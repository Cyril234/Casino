import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/HorseRaceBet.css';
import coinImg from '../../../public/pokergeld.png';
import { MdInfo } from 'react-icons/md';

// Pferde-Bilder
import blitz from '../../../public/horses/blitz.png';
import donner from '../../../public/horses/donner.png';
import eis from '../../../public/horses/eis.png';
import feuer from '../../../public/horses/feuer.png';
import glanz from '../../../public/horses/glanz.png';
import pfeil from '../../../public/horses/pfeil.png';
import schatten from '../../../public/horses/schatten.png';
import sturm from '../../../public/horses/sturm.png';
import tornado from '../../../public/horses/tornado.png';
import wirbel from '../../../public/horses/wirbel.png';

const horseImages: Record<string, string> = {
  blitz, donner, eis, feuer, glanz,
  pfeil, schatten, sturm, tornado, wirbel
};

type Horse = {
  horseId: number;
  name: string;
  winningProbability: number;
  multiplicationfactor: number;
  description: string;
};

// Wenn man aus der RaceSimulation zurückkommt, kann hier winnerHorseId stehen:
type LocationState = {
  horseIndex: number;
  bet: number;
  playerId: number;
  winnerHorseId?: number;
};

export default function HorseRace() {
  const navigate = useNavigate();
  useNavigate() /* dummy to avoid TS error */ /* dummy to avoid TS error */;
  // in your app you'll use useLocation to get state, but we only navigate from here
  const [playerId, setPlayerId]     = useState(0);
  const [coinsBalance, setCoinsBalance] = useState(0);
  const [bet, setBet]               = useState(0);
  const [allHorses, setAllHorses]   = useState<Horse[]>([]);
  const [horseIndex, setHorseIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  // no local winner state here; RaceSimulation handles and passes back

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/');
      return;
    }
    fetchPlayer(token);
    fetchHorses(token);
  }, [navigate]);

  async function fetchPlayer(token: string) {
    try {
      const res = await fetch(
        `http://localhost:8080/api/players/byToken/${token}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setPlayerId(data.playerId);
      setCoinsBalance(data.coins);
    } catch {
      console.error('Fehler beim Laden des Spielers');
    }
  }

  async function fetchHorses(token: string) {
    try {
      const res = await fetch(
        `http://localhost:8080/api/horserace/horses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setAllHorses(data);
    } catch {
      console.error('Fehler beim Laden der Pferde');
    }
  }

  const handleBet = () => {
    navigate('/gameoverview/horserace/race', {
      state: { horseIndex, bet, playerId },
    });
  };

  return (
    <div className="container">
      <div className="top-bar">
        <button className="nav-button" onClick={() => navigate('/gameoverview')}>
          Zurück
        </button>
        <button className="nav-button" onClick={() => navigate('/gameoverview/horserace/info')}>
          <MdInfo />
        </button>
      </div>

      <h1 className="titel">Pferderennen</h1>

      <div className="balance-area">
        Dein Guthaben: <strong>{coinsBalance}</strong>
        <img src={coinImg} alt="Münze" className="coin-small" />
      </div>

      <div className="bet-section">
        <label>
          Einsatz:
          <input
            type="number"
            min={1}
            value={bet}
            onChange={e => setBet(Number(e.target.value) || 0)}
          />
        </label>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      <div className="horse-slider-container">
        <div className="horse-card large">
          <img
            src={horseImages[allHorses[horseIndex]?.name.toLowerCase()]}
            alt={allHorses[horseIndex]?.name}
            className="horse-image"
          />
          <h2>{allHorses[horseIndex]?.name}</h2>
          <p>Chance: {Math.round(allHorses[horseIndex]?.winningProbability * 100)}%</p>
          <p>x{allHorses[horseIndex]?.multiplicationfactor}</p>
          <p>{allHorses[horseIndex]?.description}</p>
          <button
            className="select-button"
            onClick={handleBet}
            disabled={bet < 1}
          >
            Wette platzieren
          </button>
        </div>
        <div className="slider-indicator">
          {horseIndex + 1} / {allHorses.length}
        </div>
      </div>
    </div>
  );
}
 