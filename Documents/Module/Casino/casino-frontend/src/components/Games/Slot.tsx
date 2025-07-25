import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { MdInfo } from "react-icons/md";
import "../../styles/Slot.css";
import coinImg from "../../../public/pokergeld.png";
import sounds from "../litleThings/Sounds";
import VirtualKeyboard from "../../Keyboard/Virtuel_Numberboard";

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
  const [soundstatus, setSoundstatus] = useState(false);
  const [volume, setVolume] = useState(0);

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [focusedField, setFocusedField] = useState<"bet" | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const spinInterval = useRef<number | null>(null);
  const spinTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
      return;
    }
    sounds.stop("casinomusic.mp3");
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
        setVolume(data.volume);
        setSoundstatus(data.soundstatus === "ON");
        setAttempts(data.attempts ?? 0);
      } catch {
        setErrorMessage("Fehler beim Laden des Spielers.");
      }
    }
    fetchPlayer();
  }, [authToken, navigate, location.key]);

  useEffect(() => {
    if (!authToken) return;
    const handleSound = async () => {
      if (soundstatus && volume > 0) {
        await sounds.play("slotmusic.wav", true, 0.4);
      } else {
        sounds.stop("slotmusic.wav");
      }
    };
    handleSound();
  }, [soundstatus, volume, authToken]);

  const spin = () => {
    if (!playerId) return;
    if (bet < 1 || bet > coinsBalance) {
      setErrorMessage("Ungültiger Einsatz!");
      return;
    }

    setShowKeyboard(false);
    setFocusedField(null);
    setErrorMessage("");
    setIsSpinning(true);
    setShowResult(false);

    spinInterval.current = window.setInterval(() => {
      setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
    }, 100);

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
        setTimeout(() => setShowResult(false), 3000);
      }
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (spinInterval.current !== null) clearInterval(spinInterval.current);
      if (spinTimeout.current !== null) clearTimeout(spinTimeout.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isButton = target.closest("button") !== null;

      if (
        !inputRef.current?.contains(target) &&
        !keyboardRef.current?.contains(target) &&
        !isButton
      ) {
        setShowKeyboard(false);
        setFocusedField(null);
      }

      if (isButton) {
        setShowKeyboard(false);
        setFocusedField(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyPress = (key: string) => {
    if (focusedField === "bet") {
      setBet((prev) => {
        const newVal = Number(`${prev}${key}`);
        return newVal > coinsBalance ? prev : newVal;
      });
    }
  };

  const handleBackspace = () => {
    if (focusedField === "bet") {
      setBet((prev) => {
        const newVal = String(prev).slice(0, -1);
        return newVal === "" ? 0 : Number(newVal);
      });
    }
  };

  const handleCloseKeyboard = () => {
    setShowKeyboard(false);
    setFocusedField(null);
  };

  const handleBlur = () => {
    setTimeout(() => {
      const active = document.activeElement;
      if (active?.id !== "bet") {
        setShowKeyboard(false);
        setFocusedField(null);
      }
    }, 100);
  };

  return (
    <div className="slot-machine">
      <div className="slot-container">
        <div className="slot-header">
          <button
            className="back-button"
            onClick={() => {
              setShowKeyboard(false);
              setFocusedField(null);
              navigate("/gameoverview");
            }}
          >
            Zurück
          </button>
          <div
            className="info-button-2"
            onClick={() => {
              setShowKeyboard(false);
              setFocusedField(null);
              navigate("/gameoverview/slot/info");
            }}
          >
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
            type="text"
            value={bet}
            readOnly
            disabled={isSpinning}
            onFocus={() => {
              setFocusedField("bet");
              setShowKeyboard(true);
            }}
            onBlur={handleBlur}
            ref={inputRef}
            placeholder="Einsatz..."
          />
          <button onClick={spin} disabled={isSpinning || bet < 1}>
            Spin
          </button>
          {errorMessage && <div className="slot-error">{errorMessage}</div>}
        </div>

        {showKeyboard && (
          <div ref={keyboardRef}>
            <VirtualKeyboard
              onKeyPress={handleKeyPress}
              onBackspace={handleBackspace}
              onClose={handleCloseKeyboard}
            />
          </div>
        )}

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
