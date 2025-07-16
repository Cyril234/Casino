import { useEffect, useState } from "react";

import "../../styles/BlackJack.css";

import tableImage from "../../assets/TableBlackJack/table.png";
 
// Kartenbilder synchron laden

const cardModules = import.meta.glob("../../assets/Blackjack/*.png", { eager: true }) as Record<

  string,

  { default: string }
>;

const cardImages: Record<string, string> = {};

Object.entries(cardModules).forEach(([path, m]) => {

  const file = path.split("/").pop()!;

  const name = file.replace(".png", "");

  cardImages[name] = m.default;

});

function getCardImage(n: string) {

  return cardImages[n] || "";

}
 
// Hilfs-Function: Hand-Wert berechnen, Ass = 1 oder 11

function calculateHandValue(hand: string[]): number {

  let total = 0;

  let aces = 0;

  hand.forEach(card => {

    const rank = card.slice(0, -1); // z.B. "A", "K", "10", …

    if (rank === "A") {

      aces += 1;

      total += 1; // erst mal als 1 zählen

    } else if (["K", "Q", "J"].includes(rank)) {

      total += 10;

    } else {

      total += parseInt(rank, 10);

    }

  });

  // Versuche, so viele Asse wie möglich als 11 zu werten

  while (aces > 0 && total + 10 <= 21) {

    total += 10;

    aces -= 1;

  }

  return total;

}
 
export default function BlackJackGame() {

  const [bet, setBet] = useState(0);

  const [playerHand, setPlayerHand] = useState<string[]>([]);

  const [dealerHand, setDealerHand] = useState<string[]>([]);

  const [status, setStatus] = useState("");

  const [gameActive, setGameActive] = useState(false);

  const [playerId, setPlayerId] = useState<number | null>(null);

  const [coinsBalance, setCoinsBalance] = useState(0);

  const [coinsWon, setCoinsWon] = useState<number | null>(null);

  const [errorMessage, setErrorMessage] = useState("");

  const authToken = sessionStorage.getItem("authToken");
 
  // Beim Mount: Spieler‑ID und Guthaben holen

  useEffect(() => {

    const fetchPlayer = async () => {

      if (!authToken) return;

      try {

        const res = await fetch(

          `http://localhost:8080/api/players/byToken/${authToken}`,

          { headers: { Authorization: `Bearer ${authToken}` } }

        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        setPlayerId(data.playerId);

        if (typeof data.coins === "number") setCoinsBalance(data.coins);

      } catch (err) {

        console.error("Fehler beim Laden der Spieler‑Daten:", err);

      }

    };

    fetchPlayer();

  }, [authToken]);
 
  // CSS-Klassen und Statustext

  const statusClass =

    status === "PLAYER_WINS"

      ? "win"

      : status === "DEALER_WINS"

      ? "lose"

      : status === "DRAW"

      ? "draw"

      : status === "FEHLER"

      ? "error"

      : "";

  const statusText =

    status === "PLAYER_WINS"

      ? "Du hast gewonnen 🎉"

      : status === "DEALER_WINS"

      ? "Du hast verloren 😞"

      : status === "DRAW"

      ? "Unentschieden"

      : status === "FEHLER"

      ? errorMessage || "Fehler im Spiel"

      : "";
 
  // Spiel starten

  const startGame = async () => {

    if (!playerId) return;

    setErrorMessage("");

    try {

      const res = await fetch(

        `http://localhost:8080/blackjack/${playerId}/start?coins=${bet}`,

        { method: "POST", headers: { Authorization: `Bearer ${authToken}` } }

      );

      if (!res.ok) {

        setErrorMessage(await res.text());

        return;

      }

      const data = await res.json();

      setPlayerHand(data.playerHand);

      setDealerHand(data.dealerHand);

      setStatus("IN_PROGRESS");

      setGameActive(true);

      setCoinsWon(null);

    } catch {

      setErrorMessage("Ein Fehler ist aufgetreten.");

    }

  };
 
  // Hit

  const hit = async () => {

    if (!playerId) return;

    try {

      const res = await fetch(

        `http://localhost:8080/blackjack/${playerId}/hit`,

        { method: "POST", headers: { Authorization: `Bearer ${authToken}` } }

      );

      if (!res.ok) {

        setErrorMessage(await res.text());

        return;

      }

      const data = await res.json();

      setPlayerHand(data.playerHand);

      setStatus(data.status);

      if (data.status !== "IN_PROGRESS") await stand();

    } catch {

      setErrorMessage("Fehler bei Hit.");

    }

  };
 
  // Stand

  const stand = async () => {

    if (!playerId) return;

    try {

      const res = await fetch(

        `http://localhost:8080/blackjack/${playerId}/stand`,

        { method: "POST", headers: { Authorization: `Bearer ${authToken}` } }

      );

      if (!res.ok) {

        setStatus("FEHLER");

        setErrorMessage(await res.text());

        return;

      }

      const data = await res.json();

      setPlayerHand(data.playerHand);

      setDealerHand(data.dealerHand);

      setStatus(data.result);

      setCoinsWon(data.coinsWon);

      setGameActive(false);

      setErrorMessage("");
 
      // Guthaben aktualisieren

      if (data.result === "PLAYER_WINS" && typeof data.coinsWon === "number") {

        setCoinsBalance(prev => prev + data.coinsWon);

      } else if (data.result === "DEALER_WINS") {

        setCoinsBalance(prev => prev - bet);

      }

    } catch {

      setStatus("FEHLER");

      setErrorMessage("Server nicht erreichbar");

    }

  };
 
  // Werte anzeigen

  const playerValue = calculateHandValue(playerHand);

  const dealerValue = status !== "IN_PROGRESS" ? calculateHandValue(dealerHand) : undefined;
 
  return (
<div className="blackjack-table" style={{ backgroundImage: `url(${tableImage})` }}>

      {/* Guthaben */}
<div className="balance-area">

        Dein Guthaben: <strong>{coinsBalance} Coins</strong>
</div>
 
      {/* Einsatz */}
<div className="bet-area">
<label htmlFor="bet">Einsatz</label><br />
<input

          id="bet"

          type="number"

          value={bet}

          onChange={e => setBet(+e.target.value)}

          disabled={gameActive}

        />
<button onClick={startGame} disabled={gameActive || bet <= 0}>Start</button>

        {errorMessage && <div className="error">{errorMessage}</div>}
</div>
 
      {/* Punktestand & Wert */}
<div className="score dealer">

        Dealer: {dealerHand.length}

        {dealerValue != null && <div className="hand-value">Wert: {dealerValue}</div>}
</div>
<div className="score player">

        Du: {playerHand.length}
<div className="hand-value">Wert: {playerValue}</div>
</div>
 
      {/* Dealer-Karten */}
<div className="dealer-hand">

        {dealerHand.map((c, i) => (
<div

            key={`d-${i}`}

            className="card"

            style={{ backgroundImage: `url(${getCardImage(c)})` }}

          />

        ))}
</div>
 
      {/* Spieler-Karten */}
<div className="player-hand">

        {playerHand.map((c, i) => (
<div

            key={`p-${i}`}

            className="card"

            style={{ backgroundImage: `url(${getCardImage(c)})` }}

          />

        ))}
</div>
 
      {/* Controls */}

      {gameActive && (
<div className="controls">
<button onClick={hit}>Hit</button>
<button onClick={stand}>Stand</button>
</div>

      )}
 
      {/* Ergebnis-Meldung */}

      {status && (
<div className={`status-box ${statusClass}`}>

          {statusText}

          {coinsWon != null && status === "PLAYER_WINS" && (
<div className="coins">+{coinsWon} Coins</div>

          )}

          {status === "DEALER_WINS" && (
<div className="coins">-{bet} Coins</div>

          )}
</div>

      )}
</div>

  );
}