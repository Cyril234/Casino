import React, { useEffect, useState } from "react";
import "../../styles/Mienenfeld.css";
import tableBg from "../../../public/MinenfeldHintergrund.png";
import bombImg from "../../../public/bombe.png";
import coinImg from "../../../public/pokergeld.png";
import { useNavigate } from "react-router-dom";
import { MdInfo } from "react-icons/md";

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
      } catch (err) {
        console.error("Fehler beim Laden des Spielers:", err);
      }
    })();
  }, [authToken]);

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
    } catch {
      setErrorMessage("Fehler beim Cashout.");
    }
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
        <div className="info-button-2" onClick={() => navigate('/gameoverview/mines/info')}>
          <MdInfo />
        </div>
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
              type="number"
              value={bombs}
              min={1}
              max={fields - 1}
              onChange={e => setBombs(parseInt(e.target.value))}
            />
          </label>
          <label>
            Einsatz:
            <input
              type="number"
              value={bet}
              onChange={e => setBet(parseInt(e.target.value))}
            />
          </label>
          <button onClick={startGame}>Start</button>
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
    </div>
  );
}