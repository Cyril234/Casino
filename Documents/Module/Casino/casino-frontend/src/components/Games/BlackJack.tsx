import { useEffect, useState } from "react";

export default function BlackJackGame() {
  const [bet, setBet] = useState<number>(0);
  const [playerHand, setPlayerHand] = useState<string[]>([]);
  const [dealerHand, setDealerHand] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");
  const [gameActive, setGameActive] = useState(false);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const authToken = sessionStorage.getItem("authToken");
  const [data, setData] = useState({});
  const [coinsWon, setCoinsWon] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");


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
        setData(data);
        setPlayerId(data.playerId);
      } catch (err) {
        console.log(data)
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
    setErrorMessage(""); // Fehler zurücksetzen

    const res = await fetch(`http://localhost:8080/blackjack/${playerId}/start?coins=${bet}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      const text = await res.text();
      setErrorMessage(text);
      return;
    }

    const data = await res.json();
    setPlayerHand(data.playerHand);
    setDealerHand(data.dealerHand);
    setStatus("IN_PROGRESS");
    setGameActive(true);
    setCoinsWon(null);
  } catch (err) {
    console.error("Fehler beim Starten des Spiels:", err);
    setErrorMessage("Ein Fehler ist aufgetreten.");
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
      const text = await res.text();
      setErrorMessage(text);
      return;
    }

    const data = await res.json();
    setPlayerHand(data.playerHand);
    setStatus(data.status);

    if (data.status !== "IN_PROGRESS") {
      await stand();
    }
  } catch (err) {
    console.error("Fehler bei Hit:", err);
    setErrorMessage("Fehler bei Hit.");
  }
};


  const stand = async () => {
  try {
    const res = await fetch(`http://localhost:8080/blackjack/${playerId}/stand`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text(); // z. B. "Kein aktives Spiel vorhanden"
      setStatus("FEHLER");
      setErrorMessage(errorText);
      return;
    }

    const data = await res.json();

    setPlayerHand(data.playerHand);
    setDealerHand(data.dealerHand);
    setStatus(data.result); // z. B. "PLAYER_WINS", "DRAW", ...
    setCoinsWon(data.coinsWon);
    setGameActive(false);
    setErrorMessage(""); // vorherigen Fehler löschen
  } catch (error) {
    console.error("Fehler bei Stand:", error);
    setStatus("FEHLER");
    setErrorMessage("Verbindung zum Server fehlgeschlagen.");
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

      {errorMessage && (
      <div style={{ color: "red", marginTop: "0.5rem" }}>
      {errorMessage}
      </div>
)}

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

      {status && 
      <>
        <div><strong>Status:</strong> {status}</div>
        <div><strong>Coins gewonnen:</strong> {coinsWon}</div>
      </>
       }
    </div>
  );
}
