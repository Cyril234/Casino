import React, { useEffect, useRef, useState } from 'react';
import coinImg from "../../../public/pokergeld.png";
import sounds from "../litleThings/Sounds";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/Roulette.css';
import { MdInfo } from 'react-icons/md';
import VirtualKeyboard from '../../Keyboard/Virtuel_Numberboard';

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
    const [showKeyboard, setShowKeyboard] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);

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

  type BetItem = {
    type: string;
    value: string;
    label: string;
    isExtra?: boolean;
  };

  const bettableFields: BetItem[] = [
    ...rouletteGrid.map(n => ({
      type: 'NUMBER',
      value: n.toString(),
      label: n.toString(),
    })),
    ...extras.map(e => ({
      type: e.type,
      value: e.label,
      label: e.label,
      isExtra: true,
    }))
  ];

  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const location = useLocation();
  const navigate = useNavigate();
  const token = sessionStorage.getItem('authToken');

  const wheelNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34,
    6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18,
    29, 7, 28, 12, 35, 3, 26
  ];
  const anglePerPocket = 360 / wheelNumbers.length;

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
        await sounds.play("roulettemusic.wav", true, 1);
      } else {
        sounds.stop("roulettemusic.wav");
      }
    };
    handleSound();
  }, [soundstatus, volume, token]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;

      let newIndex = focusedIndex;

      switch (e.key) {
        case "ArrowRight":
          newIndex = (focusedIndex + 1) % bettableFields.length;
          break;
        case "ArrowLeft":
          newIndex = (focusedIndex - 1 + bettableFields.length) % bettableFields.length;
          break;
        case "ArrowUp":
          newIndex = (focusedIndex - 3 + bettableFields.length) % bettableFields.length;
          break;
        case "ArrowDown":
          newIndex = (focusedIndex + 3) % bettableFields.length;
          break;
        case "Enter":
        case " ":
          const bet = bettableFields[focusedIndex];
          toggleBet(bet.type, bet.value);
          e.preventDefault();
          return;
        default:
          return;
      }

      setFocusedIndex(newIndex);
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex]);
useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        keyboardRef.current &&
        !keyboardRef.current.contains(target)
      ) {
        setShowKeyboard(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
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
      const targetWheelDeg = (wheelNumbers.length - idx) * anglePerPocket;
      const targetBallDeg = (idx + 0.5) * anglePerPocket + offsetCorrection;

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
  const onKeyPress = (key: string) => {
    const newAmountStr = betAmount === 0 ? key : betAmount.toString() + key;
    const newAmountNum = Number(newAmountStr);
    if (newAmountNum <= 999999) {
      setBetAmount(newAmountNum);
    }
  };

  const onBackspace = () => {
    const str = betAmount.toString();
    const newStr = str.length > 1 ? str.slice(0, -1) : '0';
    setBetAmount(Number(newStr));
  };

  const onClose = () => {
    setShowKeyboard(false);
  };

  return (
    <div className="background">
      <div className="roulette-layout">
        <button className="back-button" onClick={() => navigate("/gameoverview")}>
          Zurück
        </button>
        <button className="info-button-2" onClick={() => navigate('/gameoverview/roulette/info')}>
          <MdInfo />
        </button>
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
          <div className="balance-area">
            Guthaben: <strong>{coinsBalance}</strong>
            <img src={coinImg} alt="Münze" className="coin-small" />
          </div>
          <div className="bet-amount">
            <label>Einsatz pro Feld:</label>
            <input
              ref={inputRef}
              type="text"
              value={betAmount}
              className="hello"
              readOnly
              onFocus={() => setShowKeyboard(true)}
              onBlur={() => {
                setTimeout(() => {
                  const active = document.activeElement;
                  if (active !== inputRef.current) {
                    setShowKeyboard(false);
                  }
                }, 100);
              }}
              placeholder="Einsatz"
            />
          </div>

          {showKeyboard && (
            <div ref={keyboardRef}>
              <VirtualKeyboard
                onKeyPress={onKeyPress}
                onBackspace={onBackspace}
                onClose={onClose}
              />
            </div>
          )}

          <div className="number-bets">
            {rouletteGrid.map((n, i) => {
              const isFocused = focusedIndex === i;
              return (
                <button
                  key={n}
                  className={`cell ${n === 0 ? 'green' : n % 2 === 0 ? 'black' : 'red'}
                    ${bets.find(b => b.type === 'NUMBER' && b.value === n.toString()) ? 'selected' : ''}
                    ${isFocused ? 'focused' : ''}`}
                  onClick={() => toggleBet('NUMBER', n.toString())}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <div className="special-bets">
            {extras.map(({ label, type }, i) => {
              const indexInFullList = rouletteGrid.length + i;
              const isFocused = focusedIndex === indexInFullList;
              return (
                <button
                  key={label}
                  className={`special-bet ${bets.find(b => b.type === type && b.value === label) ? 'selected' : ''}
                    ${isFocused ? 'focused' : ''}`}
                  onClick={() => toggleBet(type, label)}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <button
            className="spin-button"
            onClick={handleSpin}
            disabled={loading || bets.length === 0}
          >
            {loading ? 'Dreht...' : 'Spin'}
          </button>
          {error && <div className="error">{error}</div>}
          {result && (
            <div className="result">
              <h2>Resultat:</h2>
              <p><strong>Zahl:</strong> {result.rolledNumber}</p>
              <p><strong>Farbe:</strong> {result.rolledColor}</p>
              <p>{(result.result === "LOSE") ? "Du hast verloren" : "Du hast gewonnen"}!</p>
              <p><strong>Gewinn:</strong> {result.totalPayout}</p>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Roulette;
