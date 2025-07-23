import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { MdInfo } from "react-icons/md";
import "../../styles/Slot.css";
import coinImg from "../../../public/pokergeld.png";
 
// Dynamisch alle Slot-Symbole importieren
const symbolModules = import.meta.glob(
  "../../../public/slot-symbols/*.png",
  { eager: true }
) as Record<string, { default: string }>;

const slotImages: Record<string, string> = {};
Object.entries(symbolModules).forEach(([path, m]) => {
  const file = path.split("/").pop()!;
  const name = file.replace(".png", "");
  slotImages[name] = m.default;
});

function getRandomSymbol(): string {
  const keys = Object.keys(slotImages);
  return keys[Math.floor(Math.random() * keys.length)];
}

export default function SlotGame() {
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem("authToken");

  // State-Variablen
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [coinsBalance, setCoinsBalance] = useState(0);
  const [bet, setBet] = useState(1);
  const [reels, setReels] = useState<string[]>([
    getRandomSymbol(),
    getRandomSymbol(),
    getRandomSymbol(),
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [win, setWin] = useState(false);
  const [coinsWon, setCoinsWon] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Refs für Timer
  const spinInterval = useRef<number | null>(null);
  const spinTimeout = useRef<number | null>(null);

  // Spieler-Daten laden
  useEffect(() => {
    if (!authToken) {
      navigate("/");
      return;
    }
    async function fetchPlayer() {
      try {
        const res = await fetch(
          `http://localhost:8080/api/players/byToken/${authToken}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (!res.ok) throw new Error("Spieler konnte nicht geladen werden");
        const data = await res.json();
        setPlayerId(data.playerId);
        setCoinsBalance(data.coins);
        setAttempts(data.attempts ?? 0);
      } catch {
        setErrorMessage("Fehler beim Laden des Spielers.");
      }
    }
    fetchPlayer();
  }, [authToken, navigate]);

  // Spin-Funktion
  const spin = () => {
    if (!playerId) return;
    if (bet < 1 || bet > coinsBalance) {
      setErrorMessage("Ungültiger Einsatz!");
      return;
    }

    setErrorMessage("");
    setIsSpinning(true);
    setShowResult(false);

    // 1) Reel-Animation: Zufallsbilder alle 100ms
    spinInterval.current = window.setInterval(() => {
      setReels([
        getRandomSymbol(),
        getRandomSymbol(),
        getRandomSymbol(),
      ]);
    }, 100);

    // 2) Nach 2 Sekunden echtes Ergebnis abholen und Animation stoppen
    spinTimeout.current = window.setTimeout(async () => {
      if (spinInterval.current !== null) {
        clearInterval(spinInterval.current);
      }
      try {
        const res = await fetch(
          `http://localhost:8080/slot/${playerId}/spin?coins=${bet}`,
          { method: "POST", headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (!res.ok) {
          const msg = await res.text();
          setErrorMessage(msg);
          setIsSpinning(false);
          return;
        }
        const data = await res.json();
        // Finales Ergebnis
        setReels(data.slots);
        setWin(data.win);
        setCoinsWon(data.coinsWon);
        setCoinsBalance(data.newBalance);
        setAttempts(data.attempts);
        setShowResult(true);
      } catch {
        setErrorMessage("Fehler beim Spin.");
      } finally {
        setIsSpinning(false);
        // Ergebnisanzeige nach 3s ausblenden
        setTimeout(() => setShowResult(false), 3000);
      }
    }, 2000);
  };

  // Aufräumen bei Unmount
  useEffect(() => {
    return () => {
      if (spinInterval.current !== null) clearInterval(spinInterval.current);
      if (spinTimeout.current !== null) clearTimeout(spinTimeout.current);
    };
  }, []);

  return (
    <div className="slot-machine">
      <div className="slot-container">
        <div className="slot-header">
<button className="back-button" onClick={() => navigate("/gameoverview")}>
          Zurück
        </button>           <div className="info-button-2" onClick={() => navigate('/gameoverview/slot/info')}>
                                    <MdInfo />
        </div>
</div>
        <div className="slot-balance">
          Dein Guthaben: <strong>{coinsBalance}</strong>
          <img src={coinImg} alt="Münze" className="coin-icon" />
        </div>
       

        <div className="slot-bet-area">
          <label htmlFor="bet">Einsatz</label>
          <input
            id="bet"
            type="number"
            value={bet}
            min={1}
            max={coinsBalance}
            disabled={isSpinning}
            onChange={(e) => setBet(Number(e.target.value))}
          />
          <button onClick={spin} disabled={isSpinning || bet < 1}>
            Spin
          </button>
          {errorMessage && <div className="slot-error">{errorMessage}</div>}
        </div>

        <div className="slot-reels">
          {reels.map((symbol, i) => (
            <div
              key={i}
              className={`slot-reel ${isSpinning ? "spinning" : ""}`}
              style={{ backgroundImage: `url(${slotImages[symbol]})` }}
              title={symbol}
            />
          ))}
        </div>

        {showResult && (
          <div className={`slot-result ${win ? "win" : "lose"}`}>
            {win ? `Gewonnen! +${coinsWon}` : `Verloren: -${bet}`}
            <img src={coinImg} alt="Münze" className="coin-icon-small" />
          </div>
        )}
      </div>
    </div>
  );
}
 