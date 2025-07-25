import React, { useEffect, useRef, useState } from "react";
import "../../styles/Mienenfeld.css";
import tableBg from "../../../public/MinenfeldHintergrund.png";
import bombImg from "../../../public/bombe.png";
import coinImg from "../../../public/pokergeld.png";
import { useLocation, useNavigate } from "react-router-dom";
import { MdInfo } from "react-icons/md";
import sounds from "../litleThings/Sounds";
import VirtualKeyboardNumber from "../../Keyboard/Virtuel_Numberboard";

export default function MinesGame() {
  const authToken = sessionStorage.getItem("authToken");
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [bombs, setBombs] = useState(3);
  const [fields] = useState(25);
  const [bet, setBet] = useState(50);
  const [coinsBalance, setCoinsBalance] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [currentProfit, setCurrentProfit] = useState(0);
  const [status, setStatus] = useState("");
  const [gameActive, setGameActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bombIndex, setBombIndex] = useState<number | null>(null);
  const [soundstatus, setSoundstatus] = useState(false);
  const [volume, setVolume] = useState(0);

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [focusedField, setFocusedField] = useState<"bet" | "bombs" | null>(null);

  const startButtonRef = useRef<HTMLButtonElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!authToken) return;
    sounds.stop("casinomusic.mp3");
    (async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/players/byToken/${authToken}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPlayerId(data.playerId);
        setCoinsBalance(data.coins || 0);
        setVolume(data.volume);
        setSoundstatus(data.soundstatus === "ON");
      } catch (err) {
        console.error("Fehler beim Laden des Spielers:", err);
      }
    })();
  }, [authToken, location.key]);

  useEffect(() => {
    if (!authToken) return;
    const handleSound = async () => {
      if (soundstatus && volume > 0) {
        await sounds.play("horseracemusic.wav", true, 1);
      } else {
        sounds.stop("horseracemusic.wav");
      }
    };
    handleSound();
  }, [soundstatus, volume, authToken]);

  const startGame = async () => {
    if (!playerId || bet <= 0 || bombs >= fields || bombs <= 0) return;
    setErrorMessage("");
    try {
      const res = await fetch(
        `http://localhost:8080/mines/${playerId}/start?coins=${bet}&bombs=${bombs}&fields=${fields}`,
        { method: "POST", headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (!res.ok) {
        setErrorMessage(await res.text());
        return;
      }
      setRevealed([]);
      setCurrentProfit(0);
      setStatus("IN_PROGRESS");
      setGameActive(true);
    } catch {
      setErrorMessage("Fehler beim Starten des Spiels.");
    }
  };

  const reveal = async (index: number) => {
    if (!playerId || revealed.includes(index)) return;
    try {
      const res = await fetch(
        `http://localhost:8080/mines/${playerId}/reveal?index=${index}`,
        { method: "POST", headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "LOSE") {
        setRevealed(Array.from(data.revealed));
        setStatus("BOMBE! Alles verloren.");
        setGameActive(false);
        setCoinsBalance(prev => prev - bet);
        setBombIndex(index);

        // Fokus auf Start-Button nach kurzer Zeit
        setTimeout(() => {
          startButtonRef.current?.focus();
        }, 300);
      } else {
        setRevealed(Array.from(data.revealed));
        setCurrentProfit(data.currentProfit - bet);
      }
    } catch {
      setErrorMessage("Fehler beim Aufdecken.");
    }
  };

  const cashout = async () => {
    if (!playerId) return;
    try {
      const res = await fetch(
        `http://localhost:8080/mines/${playerId}/cashout`,
        { method: "POST", headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (!res.ok) return;
      const data = await res.json();
      setCoinsBalance(data.finalBalance);
      setStatus(`Auszahlung: +${data.profit} Coins`);
      setGameActive(false);

      // Fokus auf Start-Button nach kurzer Zeit
      setTimeout(() => {
        startButtonRef.current?.focus();
      }, 300);
    } catch {
      setErrorMessage("Fehler beim Cashout.");
    }
  };

  const handleKeyPress = (key: string) => {
    if (focusedField === "bet") {
      const newVal = String(bet) === "0" ? key : String(bet) + key;
      setBet(Math.min(Number(newVal), 999999));
    } else if (focusedField === "bombs") {
      const newVal = String(bombs) === "0" ? key : String(bombs) + key;
      const valNum = Number(newVal);
      if (valNum > 0 && valNum < fields) {
        setBombs(valNum);
      }
    }
  };

  const handleBackspace = () => {
    if (focusedField === "bet") {
      const newVal = String(bet).slice(0, -1);
      setBet(newVal === "" ? 0 : Number(newVal));
    } else if (focusedField === "bombs") {
      const newVal = String(bombs).slice(0, -1);
      setBombs(newVal === "" ? 0 : Number(newVal));
    }
  };

  const handleCloseKeyboard = () => {
    setShowKeyboard(false);
    setFocusedField(null);
  };

  const handleBlur = () => {
    setTimeout(() => {
      const active = document.activeElement;
      if (active?.id !== "bet" && active?.id !== "bombs") {
        setShowKeyboard(false);
        setFocusedField(null);
      }
    }, 100);
  };

  const renderGrid = () => {
    const lost = status.startsWith("BOMBE");
    const columns = fields <= 40 ? 5 : 8;

    return (
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          marginTop: "120px",
          marginLeft: "40px",
          maxWidth: columns * 90 + "px",
        }}
      >
        {Array.from({ length: fields }).map((_, i) => {
          const isRevealed = revealed.includes(i);
          const isSafe = isRevealed && !lost;
          const isClickedBomb = lost && bombIndex === i;

          return (
            <button
              key={i}
              onClick={() => gameActive && !isRevealed && reveal(i)}
              className={`${isSafe ? "safe" : isClickedBomb ? "bomb" : ""}`}
              disabled={!gameActive && !isRevealed}
              style={{
                backgroundImage: isSafe
                  ? `url(${coinImg})`
                  : isClickedBomb
                  ? `url(${bombImg})`
                  : undefined,
                backgroundSize: "70%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`mines-container ${status === "LOSE" ? "lost" : ""}`}
      style={{ backgroundImage: `url(${tableBg})` }}
    >
      <div className="top-left">
        <button className="back-button" onClick={() => navigate("/gameoverview")}>
          Zurück
        </button>
        <button className="info-button-2" onClick={() => navigate("/gameoverview/mines/info")}>
          <MdInfo />
        </button>
      </div>

      <div className="balance-area">
        Guthaben: <strong>{coinsBalance}</strong>
        <img src={coinImg} alt="Münze" className="coin-small" />
      </div>

      {!gameActive && (
        <div className="config-area">
          <label>
            Bomben:
            <input
              id="bombs"
              type="text"
              value={bombs}
              readOnly
              onFocus={() => {
                setFocusedField("bombs");
                setShowKeyboard(true);
              }}
              onBlur={handleBlur}
            />
          </label>
          <label>
            Einsatz:
            <input
              id="bet"
              type="text"
              value={bet}
              readOnly
              onFocus={() => {
                setFocusedField("bet");
                setShowKeyboard(true);
              }}
              onBlur={handleBlur}
            />
          </label>
          <button ref={startButtonRef} onClick={startGame}>
            Start
          </button>
          {errorMessage && <div className="error">{errorMessage}</div>}
        </div>
      )}

      {renderGrid()}

      {gameActive && (
        <div className="controls">
          <p className="profit-display">
            Auszahlung: <strong>{currentProfit}</strong>
            <img src={coinImg} alt="Münze" className="coin-small" />
          </p>
          <button onClick={cashout}>Cashout</button>
        </div>
      )}

      {status === "LOSE" && <div className="status-box lose">Verloren!</div>}
      {status === "CASHOUT" && <div className="status-box win">Auszahlung: +{currentProfit}</div>}

      {showKeyboard && (
        <div className="virtual-keyboardNumber">
          <VirtualKeyboardNumber
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
            onClose={handleCloseKeyboard}
          />
        </div>
      )}
    </div>
  );
}
