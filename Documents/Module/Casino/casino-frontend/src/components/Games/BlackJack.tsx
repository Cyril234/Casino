import { useEffect, useState } from "react";
import "../../styles/BlackJack.css";
import coinImg from "../../../public/pokergeld.png";
import tableImage from "../../assets/TableBlackJack/table.png";
import { useLocation, useNavigate } from "react-router";
import { MdInfo } from "react-icons/md";
import sounds from "../litleThings/Sounds";

const cardModules = import.meta.glob(
  "../../assets/Blackjack/*.png",
  { eager: true }
) as Record<string, { default: string }>;

const cardImages: Record<string, string> = {};

Object.entries(cardModules).forEach(([path, m]) => {
  const file = path.split("/").pop()!;
  const name = file.replace(".png", "");
  cardImages[name] = m.default;
});

function getCardImage(n: string) {
  return cardImages[n] || "";
}

function calculateHandValue(hand: string[] | undefined): number {
  if (!hand || !Array.isArray(hand)) return 0;

  let total = 0;
  let aces = 0;
  hand.forEach(card => {
    const rank = card.slice(0, -1);
    if (rank === "A") {
      aces += 1;
      total += 1;
    } else if (["K", "Q", "J"].includes(rank)) {
      total += 10;
    } else {
      total += parseInt(rank, 10);
    }
  });

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
  const [errorMessage, setErrorMessage] = useState("");

  const [resultAmount, setResultAmount] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [soundstatus, setSoundstatus] = useState(false);
  const [volume, setVolume] = useState(0);

  const authToken = sessionStorage.getItem("authToken");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!authToken) return;
      sounds.stop("casinomusic.mp3");
      try {
        const res = await fetch(
          `http://localhost:8080/api/players/byToken/${authToken}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPlayerId(data.playerId);
        setVolume(data.volume);
        setSoundstatus(data.soundstatus === "ON");
        if (typeof data.coins === "number") {
          setCoinsBalance(data.coins);
        }
      } catch (err) {
        console.error("Fehler beim Laden der Spieler‑Daten:", err);
      }
    };
    fetchPlayer();
  }, [authToken, location.key]);

  useEffect(() => {
    if (!authToken) return;
    const handleSound = async () => {
      if (soundstatus && volume > 0) {
        await sounds.play("blackjackmusic.wav", true, 1);
      } else {
        sounds.stop("blackjackmusic.wav");
      }
    };

    handleSound();
  }, [soundstatus, volume, authToken]);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
      return;
    }
  });

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
      setPlayerHand(data.playerHand ?? []);
      setDealerHand(data.dealerHand ?? []);
      setStatus("IN_PROGRESS");
      setGameActive(true);
      setResultAmount(null);
    } catch {
      setErrorMessage("Ein Fehler ist aufgetreten.");
    }
  };

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
      setPlayerHand(data.playerHand ?? []);
      setStatus(data.status);
      if (data.status !== "IN_PROGRESS") {
        await stand();
      }
    } catch {
      setErrorMessage("Fehler bei Hit.");
    }
  };

  const double = async () => {
    if (!playerId) return;
    try {
      const res = await fetch(
        `http://localhost:8080/blackjack/${playerId}/double`,
        { method: "POST", headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (!res.ok) {
        setErrorMessage(await res.text());
        return;
      }

      const data = await res.json();
      setPlayerHand(data.playerHand ?? []);
      setDealerHand(data.dealerHand ?? []);
      setStatus(data.result);
      setGameActive(false);

      if (data.result === "PLAYER_WINS" && typeof data.coinsWon === "number") {
        setResultAmount(data.coinsWon);
        setCoinsBalance((prev) => prev + (data.coinsWon / 2));
      } else if (data.result === "DEALER_WINS") {
        setResultAmount(-bet * 2);
        setCoinsBalance((prev) => prev - (bet * 2));
      } else {
        setResultAmount(0);
      }

      setShowResult(true);
      setTimeout(() => setShowResult(false), 2000);
    } catch (err) {
      setErrorMessage("Fehler bei Double.");
    }
  };

  const stand = async () => {
    if (!playerId) return;
    try {
      const res = await fetch(
        `http://localhost:8080/blackjack/${playerId}/stand`,
        { method: "POST", headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (!res.ok) {
        setStatus("FEHLER");
        return;
      }
      const data = await res.json();
      setPlayerHand(data.playerHand ?? []);
      setDealerHand(data.dealerHand ?? []);
      setStatus(data.result);
      setGameActive(false);

      if (data.result === "PLAYER_WINS" && typeof data.coinsWon === "number") {
        setResultAmount(data.coinsWon);
        setCoinsBalance((prev) => prev + data.coinsWon);
      } else if (data.result === "DEALER_WINS") {
        setResultAmount(-bet);
        setCoinsBalance((prev) => prev - bet);
      } else {
        setResultAmount(0);
      }

      setShowResult(true);
      setTimeout(() => setShowResult(false), 2000);
    } catch {
      setStatus("FEHLER");
    }
  };

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = status !== "IN_PROGRESS" ? calculateHandValue(dealerHand) : undefined;

  return (
    <div className="blackjack-table" style={{ backgroundImage: `url(${tableImage})` }}>
      <div className="top-left">
        <button className="back-button" onClick={() => navigate("/gameoverview")}>
          Zurück
        </button>
        <div className="info-button" onClick={() => navigate("/gameoverview/blackjack/info")}>
          <MdInfo />
        </div>
      </div>

      <div className="balance-area">
        Dein Guthaben: <strong>{coinsBalance}</strong>
        <img src={coinImg} alt="Münze" className="coin-small" />
      </div>

      <div className="bet-area">
        <h3>Einsatz</h3>
        <input
          id="bet"
          type="number"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
          disabled={gameActive}
          placeholder="Einsatz eingeben"
        />
        <button onClick={startGame} disabled={gameActive || bet <= 0}>
          Spiel starten
        </button>
        {errorMessage && <div className="error">{errorMessage}</div>}
      </div>

      <div>
        <div className="score player">
          Du: {playerHand?.length ?? 0}
          <div className="hand-value">Wert: {playerValue}</div>
        </div>

        <div className="dealer-hand">
          {dealerHand?.map((c, i) => (
            <div
              key={`d-${i}`}
              className="card"
              style={{ backgroundImage: `url(${getCardImage(c)})` }}
            />
          ))}
        </div>

        <div className="player-hand">
          {playerHand?.map((c, i) => (
            <div
              key={`p-${i}`}
              className="card"
              style={{ backgroundImage: `url(${getCardImage(c)})` }}
            />
          ))}
        </div>

        {gameActive && (
          <div className="controls">
            <button onClick={hit}>Hit</button>
            <button onClick={stand}>Stand</button>
            <button onClick={double}>Double</button>
          </div>
        )}

        <div className="score dealer">
          Dealer: {dealerHand?.length ?? 0}
          {dealerValue != null && <div className="hand-value">Wert: {dealerValue}</div>}
        </div>

        {showResult && resultAmount != null && (
          <div className={`status-box ${resultAmount >= 0 ? "win" : "lose"}`}>
            {resultAmount >= 0 ? `+${resultAmount}` : `${resultAmount}`}
            <img src={coinImg} alt="Münze" className="coin-small" />
          </div>
        )}
      </div>
    </div>
  );
}
