import React, { useState } from "react";
import "../../styles/Pocker.css";
import { useLocation } from "react-router-dom";
import { usePokerGame, PokerGameProvider, Style } from "./PokerGameContext";
import type { Enemy, Player } from "./PokerGameContext";
import { getNPCDecision } from "./EnemyLogik";

const SMALL_BLIND = 10;
const BIG_BLIND = 20;

type Participant =
  | (Player & { name: string; isUser: true })
  | (Enemy & { name: string; isUser: false });

const PokerTable: React.FC = () => {
  const location = useLocation();
  const smallBlind = location.state?.smalBlind ?? SMALL_BLIND;
  const { players, enemys, setPlayers, setEnemys, setupGame, dealCards } = usePokerGame();
  const [started, setStarted] = useState(false);
  const [actions, setActions] = useState<{ [pos: number]: string }>({});
  const [stacks, setStacks] = useState<{ [pos: number]: number }>({});
  const [userInput, setUserInput] = useState("");
  const [userActed, setUserActed] = useState(false);

  // Kombiniere Spieler und NPCs zu einer Liste und sortiere nach Position
  const allParticipants: Participant[] = [
    ...players.map(p => ({ ...p, name: "Player", isUser: true as const })),
    ...enemys.map(e => ({ ...e, name: e.name, isUser: false as const }))
  ].sort((a, b) => a.position - b.position);

  // Initialisiere Stacks und Blinds beim Start
  const handleStart = () => {
    setupGame(smallBlind);
    dealCards();
    setStarted(true);
    setTimeout(() => {
      const stacksInit: { [pos: number]: number } = {};
      allParticipants.forEach(p => {
        stacksInit[p.position] = p.stack;
      });
      const sbPos = 0;
      const bbPos = 1;
      stacksInit[sbPos] -= SMALL_BLIND;
      stacksInit[bbPos] -= BIG_BLIND;
      setStacks(stacksInit);
      setActions({
        [sbPos]: `Small Blind (${SMALL_BLIND})`,
        [bbPos]: `Big Blind (${BIG_BLIND})`
      });
    }, 0);
  };

  // Wer ist als nächstes dran? (nach Blinds, also Position 2)
  const nextToAct = 2;
  const user = allParticipants.find(p => p.isUser);
  const userPos = user?.position ?? 0;

  // Handler für User-Action
  const handleUserAction = () => {
    setActions(prev => ({ ...prev, [userPos]: userInput }));
    setUserActed(true);
    if (userInput.toLowerCase().startsWith("call")) {
      setStacks(prev => ({ ...prev, [userPos]: prev[userPos] - BIG_BLIND }));
    } else if (userInput.toLowerCase().startsWith("raise")) {
      const amount = parseInt(userInput.split(" ")[1]) || 0;
      setStacks(prev => ({ ...prev, [userPos]: prev[userPos] - amount }));
    }
  };

  // Type Guard für NPCs
  function isNPC(p: Participant): p is Enemy & { name: string; isUser: false } {
    return p.isUser === false;
  }

  // NPC-Entscheidungen für alle, die nicht SB/BB/User sind
  React.useEffect(() => {
    if (!started) return;
    if (!userActed && userPos === nextToAct) return;
    allParticipants.forEach(p => {
      if (isNPC(p) && p.position > 1 && !actions[p.position]) {
        const equity = 0.3;
        const decision = getNPCDecision(
          {
            style: p.style,
            stack: stacks[p.position],
            position: p.position,
            tightness: p.tightness,
            bluffFactor: p.bluffFactor
          },
          [p.cards[0] || "", p.cards[1] || ""],
          equity,
          SMALL_BLIND + BIG_BLIND,
          BIG_BLIND
        );
        setActions(prev => ({ ...prev, [p.position]: decision.action + (decision.amount ? ` (${decision.amount})` : "") }));
        if (decision.action === "call") {
          setStacks(prev => ({ ...prev, [p.position]: prev[p.position] - BIG_BLIND }));
        } else if (decision.action === "raise") {
          setStacks(prev => ({ ...prev, [p.position]: prev[p.position] - (decision.amount || 0) }));
        }
      }
    });
  }, [started, userActed, actions, stacks, allParticipants, userPos]);

  return (
    <div className="pocket-table-bg">
      {!started ? (
        <button onClick={handleStart}>Spiel starten</button>
      ) : (
        <div>
          <h2>Alle Teilnehmer (nach Position sortiert)</h2>
          <ul>
            {allParticipants.map((p, i) => (
              <li key={i}>
                <strong>Position:</strong> {p.position} <br />
                <strong>Name:</strong> {p.name} <br />
                <strong>Karten:</strong> {p.cards[0]} {p.cards[1]} <br />
                <strong>Stack:</strong> {stacks[p.position] ?? p.stack} <br />
                <strong>Aktion:</strong> {actions[p.position] || (p.isUser && p.position === nextToAct && !userActed ? (
                  <span>
                    <input
                      type="text"
                      value={userInput}
                      onChange={e => setUserInput(e.target.value)}
                      placeholder="z.B. call, raise 50, fold"
                    />
                    <button onClick={handleUserAction}>OK</button>
                  </span>
                ) : "-")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Pocker: React.FC = () => (
  <PokerGameProvider>
    <PokerTable />
  </PokerGameProvider>
);

export default Pocker;
