// src/components/Games/RaceSimulation.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/RaceSimulator.css';
import { MdArrowBack } from 'react-icons/md';

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

type Horse = { horseId: number; name: string };
type LocationState = { horseIndex: number; bet: number; playerId: number };

export default function RaceSimulation() {
  const navigate = useNavigate();
  const locationState = useLocation().state as LocationState | undefined;
  const horseIndex = locationState?.horseIndex ?? 0;
  const bet = locationState?.bet ?? 0;
  const playerId = locationState?.playerId;
  const token = sessionStorage.getItem('authToken');

  const [allHorses, setAllHorses] = useState<Horse[]>([]);
  const [winner, setWinner] = useState<number | null>(null);
  const [coinsWon, setCoinsWon] = useState<number | null>(null);
  const [raceRunning, setRaceRunning] = useState(false);
  const [durations, setDurations] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadHorsesAndStart = async () => {
    if (!token || playerId === undefined) {
      navigate('/');
      return;
    }
    try {
      // 1. Pferde abrufen
      const resH = await fetch(
        `http://localhost:8080/api/horserace/horses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const horses: Horse[] = await resH.json();
      setAllHorses(horses);

      // 2. Spiel starten
      await fetch(
        `http://localhost:8080/api/horserace/${playerId}/startgame?horseId=${horses[horseIndex].horseId}&coins=${bet}`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      );

      // 3. Ergebnis holen
      const resR = await fetch(
        `http://localhost:8080/api/horserace/${playerId}/result?horseId=${horses[horseIndex].horseId}&coins=${bet}`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await resR.json();
      console.log('Race result:', data);
      // Passe hier den Key an, falls dein Backend z.B. coins_won zurückliefert
      const winnerId: number = data.horseId;
      const wonAmount: number = data.coinsWon ?? data.coins_won ?? 0;
      setWinner(winnerId);
      setCoinsWon(wonAmount);

      // 4. Animationsdauern festlegen: Sieger am schnellsten
      const baseTime = 4; // Sieger braucht 4s
      const times = horses.map((h, idx) =>
        h.horseId === winnerId
          ? baseTime
          : baseTime + (idx + 1) // jeder andere 1s länger je Position
      );
      setDurations(times);
      setRaceRunning(true);
    } catch (err) {
      console.error(err);
      setError('Fehler beim Laden oder Starten des Rennens.');
      setRaceRunning(false);
    }
  };

  // Sobald das Gewinner-Pferd seine Animation beendet, stoppt das Rennen
  const onWinnerAnimationEnd = (e: React.AnimationEvent<HTMLImageElement>) => {
    if (Number(e.currentTarget.dataset.horseId) === winner) {
      setRaceRunning(false);
    }
  };

  return (
    <div className="race-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <MdArrowBack /> Zurück
      </button>
      <h1>Rennen simulieren</h1>

      {error && <div className="error">{error}</div>}

      {!raceRunning && winner === null && (
        <button className="start-btn" onClick={loadHorsesAndStart}>
          Rennen starten
        </button>
      )}

      <div className="race-track">
        {allHorses.map((h, idx) => (
          <img
            key={h.horseId}
            data-horse-id={h.horseId}
            src={horseImages[h.name.toLowerCase()]}
            alt={h.name}
            className={`runner ${raceRunning ? 'running' : ''}`}
            style={{
              top: `${10 + idx * 8}%`,
              animationDuration: durations[idx] ? `${durations[idx]}s` : '0s'
            }}
            onAnimationEnd={h.horseId === winner ? onWinnerAnimationEnd : undefined}
          />
        ))}
      </div>

      {!raceRunning && winner !== null && coinsWon != null && (
        <div className="finish-banner">
          <h2>Sieger: {allHorses.find(h => h.horseId === winner)?.name}</h2>
          <p className={coinsWon >= 0 ? 'win-amount' : 'lose-amount'}>
            {coinsWon > 0 ? `Gewonnen ` : `Verloren `}
          </p>
        </div>
      )}
    </div>
  );
}
 