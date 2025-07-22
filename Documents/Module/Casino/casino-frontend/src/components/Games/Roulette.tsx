import React, { useEffect, useState } from 'react';

import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import '../../styles/Roulette.css';
import { MdInfo } from 'react-icons/md';

interface Bet {

  type: string;

  value: string;

  amount: number;

}

interface SpinResult {

  rolledNumber: number;

  rolledColor: string;

  totalBet: number;

  totalPayout: number;

  newBalance: number;

  result: string;

}

const Roulette: React.FC = () => {

  const [betAmount, setBetAmount] = useState<number>(10);

  const [playerId, setPlayerId] = useState<number | null>(null);

  const [bets, setBets] = useState<Bet[]>([]);

  const [result, setResult] = useState<SpinResult | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [coinsBalance, setCoinsBalance] = useState<number>(0);

  // Drehwinkel für Rad + Kugel

  const [wheelRotation, setWheelRotation] = useState<number>(0);

  const [ballRotation, setBallRotation] = useState<number>(0);

  // Europäisches Roulette‑Layout (37 Taschen)

  const wheelNumbers = [

    0, 32, 15, 19, 4, 21, 2, 25, 17, 34,

    6, 27, 13, 36, 11, 30, 8, 23, 10, 5,

    24, 16, 33, 1, 20, 14, 31, 9, 22, 18,

    29, 7, 28, 12, 35, 3, 26

  ];

  const anglePerPocket = 360 / wheelNumbers.length;

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
      navigate('/');
      return; // verhindert, dass der Rest der Effect-Logik ausgeführt wird
    }

    const fetchPlayer = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/players/byToken/${token}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPlayerId(res.data.playerId);
        setCoinsBalance(res.data.coins);
      } catch (err) {
        setError('Fehler beim Laden des Spielers.');
        navigate('/');
      }
    };

    fetchPlayer();
  }, [navigate]);

  const toggleBet = (type: string, value: string) => {

    setBets(prev => {

      const exists = prev.find(b => b.type === type && b.value === value);

      if (exists) return prev.filter(b => !(b.type === type && b.value === value));

      return [...prev, { type, value, amount: betAmount }];

    });

  };

  const handleSpin = async () => {

    if (!playerId || bets.length === 0) return;

    setLoading(true);

    setError(null);

    setResult(null);

    try {

      const res = await axios.post(

        `http://localhost:8080/roulette/${playerId}/spin-multi`,

        bets,

        {

          headers: {

            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,

            'Content-Type': 'application/json'

          }

        }

      );

      const rolled: number = res.data.rolledNumber;

      const idx = wheelNumbers.indexOf(rolled);

      // Anzahl der vollen Umdrehungen

      const spins = 360 * 5;

      // Rad im Uhrzeigersinn: spins + (wheelNumbers.length - idx)*angle

      const newWheelRot = spins + (wheelNumbers.length - idx) * anglePerPocket;

      // Kugel ebenfalls im Uhrzeigersinn: spins + idx*angle

      const newBallRot = spins + idx * anglePerPocket;

      setWheelRotation(newWheelRot);

      setBallRotation(newBallRot);

      // Ergebnis erst nach Ende der Animation anzeigen (4s)

      setTimeout(() => {

        setResult(res.data);

        setCoinsBalance(res.data.newBalance);

        setBets([]);

        setLoading(false);

      }, 4000);

    } catch (err: any) {

      setError(err.response?.data?.message || 'Etwas ist schiefgelaufen.');

      setLoading(false);

    }

  };

  const rouletteGrid = Array.from({ length: 37 }, (_, i) => i);

  const extras = [

    { label: 'RED', type: 'COLOR' },

    { label: 'BLACK', type: 'COLOR' },

    { label: 'EVEN', type: 'EVENODD' },

    { label: 'ODD', type: 'EVENODD' },

    { label: 'LOW', type: 'HIGHLOW' },

    { label: 'HIGH', type: 'HIGHLOW' },

    { label: '1ST12', type: 'DOZEN' },

    { label: '2ND12', type: 'DOZEN' },

    { label: '3RD12', type: 'DOZEN' },

    { label: 'ROW1', type: 'ROW' },

    { label: 'ROW2', type: 'ROW' },

    { label: 'ROW3', type: 'ROW' }

  ];

  return (
    <div className="background">
      <div className="roulette-layout">
        <button
          className="back"
          onClick={() => navigate('/gameoverview')}
        >
          Zurück
        </button>
        <button className="btn info" onClick={() => navigate('/gameoverview/roulette/info')}>
          <MdInfo size={24} />
        </button>
        {/* Rad + Kugel */}
        <div className="roulette-left">
          <div className="roulette-wheel-wrapper">
            <div
              className="roulette-wheel"
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              <div
                className="roulette-ball"
                style={{
                  transform: `rotate(${ballRotation}deg) translateY(-160px)`
                }}
              />
            </div>
          </div>
        </div>
        {/* UI */}
        <div className="bet-panel">
          <h2> Roulette</h2>
          <div className="balance">
            Guthaben: <strong>{coinsBalance}</strong> Coins
          </div>
          <div className="bet-amount">
            <label>Einsatz pro Feld:</label>
            <input
              type="number"
              min={1}
              value={betAmount}
              className='hello'
              onChange={e => setBetAmount(Number(e.target.value))}
            />
          </div>
          <div className="number-bets">
            {rouletteGrid.map(n => (
              <div
                key={n}
                className={`cell ${n === 0 ? 'green' : n % 2 === 0 ? 'black' : 'red'
                  } ${bets.find(b => b.type === 'NUMBER' && b.value === n.toString())
                    ? 'selected' : ''
                  }`}
                onClick={() => toggleBet('NUMBER', n.toString())}
              >
                {n}
              </div>
            ))}

          </div>
          <div className="special-bets">
            {extras.map(({ label, type }) => (
              <div
                key={label}
                className={`special-bet ${bets.find(b => b.type === type && b.value === label)
                  ? 'selected' : ''
                  }`}
                onClick={() => toggleBet(type, label)}
              >
                {label}
              </div>
            ))}
          </div>
          <button
            className="spin-btn"
            onClick={handleSpin}
            disabled={loading}
          >
            Spin
          </button>
          {error && <div className="error">{error}</div>}

          {result && (
            <div className="result">
              <p><strong>Zahl:</strong> {result.rolledNumber}</p>
              <p><strong>Farbe:</strong> {result.rolledColor}</p>
              <p><strong>Ergebnis:</strong> {result.result}</p>
              <p><strong>Gewinn:</strong> {result.totalPayout}</p>
              <p><strong>Kontostand:</strong> {result.newBalance}</p>
            </div>
          )}
        </div>
      </div>
    </div>

  );

};

export default Roulette;

