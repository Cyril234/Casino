import { useEffect, useState } from "react";

export default function BlackJackGame() {
  const [bet, setBet] = useState<number>(0);
  const [playerHand, setPlayerHand] = useState<string[]>([]);
  const [dealerHand, setDealerHand] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [gameActive, setGameActive] = useState(false);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const authToken = sessionStorage.getItem("authToken");

  useEffect(() => {
    const fetchPlayerId = async () => {
      if (!authToken) {
        console.error("Kein Auth-Token gefunden.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080/api/players/byToken/${authToken}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
          throw new Error(`HTTP Fehler: ${res.status}`);
        }

        const data = await res.json();
        setPlayerId(data.playerId);
        console.log(data.playerId)
      } catch (err) {
        console.error("Fehler bei dem Bekommen der SpielerId:", err);
      }
    };

    fetchPlayerId();
  }, [authToken]);

  const startGame = async () => {
    if (!playerId) {
      console.error("Spieler-ID nicht verfügbar.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/blackjack/${playerId}/start?coins=${bet}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP Fehler: ${res.status}`);
      }

      const data = await res.json();
      setPlayerHand(data.playerHand);
      setDealerHand(data.dealerHand);
      setStatus("IN_PROGRESS");
      setResult("");
      setGameActive(true);
    } catch (err) {
      console.error("Fehler beim Starten des Spiels:", err);
    }
  };

  const hit = async () => {
    if (!playerId) return;

    try {
      const res = await fetch(`http://localhost:8080/blackjack/${playerId}/hit`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP Fehler: ${res.status}`);
      }

      const data = await res.json();
      setPlayerHand(data.playerHand);
      setStatus(data.status);
      if (data.status !== "IN_PROGRESS") {
        setGameActive(false);
      }
    } catch (err) {
      console.error("Fehler bei Hit:", err);
    }
  };

  const stand = async () => {
    if (!playerId) return;

    try {
      const res = await fetch(`http://localhost:8080/blackjack/${playerId}/stand`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP Fehler: ${res.status}`);
      }

      const data = await res.json();
      setPlayerHand(data.playerHand);
      setDealerHand(data.dealerHand);
      setResult(data.result);
      setStatus("FINISHED");
      setGameActive(false);
    } catch (err) {
      console.error("Fehler bei Stand:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Blackjack</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>Einsatz: </label>
        <input
          type="number"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
          disabled={gameActive}
        />
        <button onClick={startGame} disabled={gameActive || bet <= 0}>
          Spiel starten
        </button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Spieler:</strong> {playerHand.join(" ")}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Dealer:</strong> {dealerHand.join(" ")}
      </div>

      {gameActive && (
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={hit} style={{ marginRight: "1rem" }}>
            Hit
          </button>
          <button onClick={stand}>Stand</button>
        </div>
      )}

      {status && <div><strong>Status:</strong> {status}</div>}
      {result && <div><strong>Ergebnis:</strong> {result}</div>}
    </div>
  );
}
