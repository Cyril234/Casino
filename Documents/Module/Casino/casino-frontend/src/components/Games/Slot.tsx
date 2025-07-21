import { useState, useEffect } from "react";
import coinImg from "../../../public/pokergeld.png";

const symbols = ["bell", "cherry", "lemon", "seven"];
const symbolMap: Record<string, string> = {
  bell: "/slot-symbols/bell.png",
  cherry: "/slot-symbols/cherry.png",
  lemon: "/slot-symbols/lemon.png",
  seven: "/slot-symbols/seven.png",
};

export default function Slot() {
  const [coinsBalance, setCoinsBalance] = useState(100); // Startguthaben
  const [bet, setBet] = useState(0);
  const [reels, setReels] = useState<string[]>(["cherry", "cherry", "cherry"]);
  const [resultAmount, setResultAmount] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getSymbolUrl = (symbol: string) => symbolMap[symbol] || "";

  const spin = () => {
    setErrorMessage("");
    if (bet <= 0) {
      setErrorMessage("Bitte einen Einsatz größer als 0 eingeben.");
      return;
    }
    if (bet > coinsBalance) {
      setErrorMessage("Nicht genügend Coins für den Einsatz.");
      return;
    }

    // Einsatz abziehen
    setCoinsBalance((prev) => prev - bet);

    // Zufällige Symbole generieren
    const newReels: string[] = [];
    for (let i = 0; i < 3; i++) {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      newReels.push(randomSymbol);
    }
    setReels(newReels);

    // Gewinn prüfen: z.B. alle drei Symbole gleich = 3x Gewinn
    if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
      const winAmount = bet * 3;
      setCoinsBalance((prev) => prev + winAmount);
      setResultAmount(winAmount);
    } else {
      setResultAmount(-bet);
    }
    setShowResult(true);

    // Ergebnisanzeige nach 2 Sekunden ausblenden
    setTimeout(() => {
      setShowResult(false);
      setResultAmount(null);
    }, 2000);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", textAlign: "center", fontSize: "1.5rem", fontWeight: "bold", padding: 20 }}>
      <div style={{ marginBottom: 30 }}>
        <div style={{ fontSize: "2rem" }}>
          Guthaben: {coinsBalance}{" "}
          <img
            src={coinImg}
            alt="Münze"
            style={{ width: 40, height: 40, verticalAlign: "middle", marginLeft: 10 }}
          />
        </div>
      </div>

      <div
        className="slot-machine"
        style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 30 }}
      >
        {reels.map((symbol, index) => {
          const url = getSymbolUrl(symbol);
          return (
            <div
              key={index}
              className="reel-slot"
              style={{
                width: 150,
                height: 150,
                border: "5px solid #333",
                borderRadius: 15,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#eee",
              }}
            >
              {url ? (
                <img
                  src={url}
                  alt={symbol}
                  className="slot-symbol"
                  style={{ width: 100, height: 100 }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div>Kein Symbol</div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="bet" style={{ fontSize: "1.8rem", marginRight: 10 }}>
          Einsatz:
        </label>
        <input
          id="bet"
          type="number"
          value={bet}
          min={1}
          max={coinsBalance}
          onChange={(e) => setBet(Number(e.target.value))}
          style={{
            fontSize: "1.6rem",
            padding: "8px 12px",
            width: 120,
            borderRadius: 8,
            border: "2px solid #333",
            textAlign: "center",
          }}
        />
      </div>

      {errorMessage && (
        <div
          style={{
            color: "red",
            marginBottom: 20,
            fontSize: "1.6rem",
            fontWeight: "bold",
          }}
        >
          {errorMessage}
        </div>
      )}

      <button
        onClick={spin}
        disabled={bet <= 0 || bet > coinsBalance}
        style={{
          fontSize: "2rem",
          padding: "15px 40px",
          borderRadius: 10,
          border: "none",
          backgroundColor: bet > 0 && bet <= coinsBalance ? "#007bff" : "#aaa",
          color: "white",
          cursor: bet > 0 && bet <= coinsBalance ? "pointer" : "not-allowed",
          fontWeight: "bold",
          boxShadow: "0 5px 10px rgba(0,0,0,0.3)",
          transition: "background-color 0.3s",
        }}
      >
        Spin
      </button>

      {showResult && resultAmount != null && (
        <div
          style={{
            marginTop: 30,
            fontSize: "2rem",
            fontWeight: "bold",
            color: resultAmount > 0 ? "green" : "red",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          {resultAmount > 0 ? `+${resultAmount}` : `${resultAmount}`}{" "}
          <img src={coinImg} alt="Münze" style={{ width: 40, height: 40 }} />
        </div>
      )}
    </div>
  );
}
