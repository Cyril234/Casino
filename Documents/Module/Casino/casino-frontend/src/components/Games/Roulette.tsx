import React, { useEffect, useState } from 'react';
import coinImg from "../../../public/pokergeld.png";
import sounds from "../litleThings/Sounds";

import axios from 'axios';

import { useLocation, useNavigate } from 'react-router-dom';

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
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [ballRotation, setBallRotation] = useState<number>(0);
  const [soundstatus, setSoundstatus] = useState(false);
  const [volume, setVolume] = useState(0);

  const location = useLocation();
  const wheelNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34,
    6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18,
    29, 7, 28, 12, 35, 3, 26
  ];

  const anglePerPocket = 360 / wheelNumbers.length;
  const navigate = useNavigate();
  const token = sessionStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    sounds.stop("casinomusic.mp3");
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
        setVolume(res.data.volume);
        setSoundstatus(res.data.soundstatus === "ON");
      } catch (err) {
        setError('Fehler beim Laden des Spielers.');
        navigate('/');
      }
    };

    fetchPlayer();
  }, [navigate, location.key]);

  useEffect(() => {
    if (!token) return;
    const handleSound = async () => {
      if (soundstatus && volume > 0) {
        await sounds.play("roulettemusic.wav", true, 0.4);
      } else {
        sounds.stop("roulettemusic.wav");
      }
    };

    handleSound();
  }, [soundstatus, volume, token]);

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

    const wheelElem = document.querySelector('.roulette-wheel') as HTMLElement;
    const ballElem = document.querySelector('.roulette-ball') as HTMLElement;

    if (wheelElem && ballElem) {
      wheelElem.classList.add('no-transition');
      ballElem.classList.add('no-transition');

      setWheelRotation(0);
      setBallRotation(720);

      setTimeout(() => {
        wheelElem.classList.remove('no-transition');
        ballElem.classList.remove('no-transition');

        spinWithResult();
      }, 10);
    } else {
      spinWithResult();
    }
  };

  const spinWithResult = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/roulette/${playerId}/spin-multi`, bets,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const rolled: number = res.data.rolledNumber;
      const idx = wheelNumbers.indexOf(rolled);
      const spins = 360 * 5;
      const offsetCorrection = -4.86;
      const correctedIdx = idx;
      const targetWheelDeg = (wheelNumbers.length - idx) * anglePerPocket;
      const targetBallDeg = (correctedIdx + 0.5) * anglePerPocket + offsetCorrection;

      setWheelRotation(spins + targetWheelDeg);
      setBallRotation(0);

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
        <button className="back-button" onClick={() => navigate("/gameoverview")}>
          Zurück
        </button>
        <div className="info-button-2" onClick={() => navigate('/gameoverview/roulette/info')}>
          <MdInfo />
        </div>
        <div className="roulette-left">
          <div className="roulette-wheel-wrapper">
            <div
              className="roulette-wheel"
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            />
              <div
                className="roulette-ball"
                style={{
                  transform: `rotate(${ballRotation}deg) translateY(-160px)`
                }}
                
              />
          </div>
        </div>
        <div className="bet-panel">
          <h2> Roulette</h2>
          <div className="balance-area">

            Guthaben: <strong>{coinsBalance}</strong>
            <img src={coinImg} alt="Münze" className="coin-small" />
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

