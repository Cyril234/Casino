import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/HorseRaceBet.css';
import coinImg from '../../../public/pokergeld.png';
import { MdInfo } from 'react-icons/md';
import sounds from "../litleThings/Sounds";
import VirtualKeyboard from '../../Keyboard/Virtual_Numberboard';

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

export default function HorseRace() {
    const navigate = useNavigate();
    const [playerId, setPlayerId] = useState(0);
    const [coinsBalance, setCoinsBalance] = useState(0);
    const [bet, setBet] = useState(0);
    const [allHorses, setAllHorses] = useState<Horse[]>([]);
    const [horseIndex, setHorseIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [soundstatus, setSoundstatus] = useState(false);
    const [volume, setVolume] = useState(0);

    const [showKeyboard, setShowKeyboard] = useState(false);
    const [focusedField, setFocusedField] = useState<"bet" | null>(null);

    const location = useLocation();
    const token = sessionStorage.getItem('authToken');

    useEffect(() => {
        sounds.stop("casinomusic.mp3");
        if (!token) {
            navigate('/');
            return;
        }
        fetchPlayer(token);
        fetchHorses(token);
    }, [navigate, location.key]);

useEffect(() => {
  const isTextInputLike = (el: Element | null) => {
    if (!el || !(el instanceof HTMLElement)) return false;
    const tag = el.tagName.toLowerCase();
    if (el.isContentEditable) return true;
    if (tag === "input" || tag === "textarea") return true;
    // alles innerhalb deines virtuellen Keyboards blocken
    if (el.closest(".virtual-keyboardNumber")) return true;
    // optional: per Daten-Attribut global blocken können
    if (el.closest("[data-hotkeys-block]")) return true;
    return false;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;

    // Wenn Keyboard offen ODER ein Eingabeelement fokussiert ist → nichts tun
    if (showKeyboard || isTextInputLike(target)) return;

    if (allHorses.length === 0) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      setHorseIndex(prev => (prev + 1) % allHorses.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setHorseIndex(prev => (prev - 1 + allHorses.length) % allHorses.length);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [allHorses.length, showKeyboard]);

    useEffect(() => {
        if (!token) return;
        const handleSound = async () => {
            if (soundstatus && volume > 0) {
                await sounds.play("blackjackmusic.wav", true, 1);
            } else {
                sounds.stop("horseracemusic.wav");
            }
        };

        handleSound();
    }, [soundstatus, volume, token]);

    async function fetchPlayer(token: string) {
        try {
            const res = await fetch(
                `http://localhost:8080/api/players/byToken/${token}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            setPlayerId(data.playerId);
            setCoinsBalance(data.coins);
            setVolume(data.volume);
            setSoundstatus(data.soundstatus === "ON");
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

    const handleKeyPress = (key: string) => {
        if (focusedField === "bet") {
            setBet(prev => Number(`${prev}${key}`));
        }
    };

    const handleBackspace = () => {
        if (focusedField === "bet") {
            setBet(prev => Number(String(prev).slice(0, -1)) || 0);
        }
    };

    const handleCloseKeyboard = () => {
        setShowKeyboard(false);
        setFocusedField(null);
    };

    const handleBlur = () => {
        setTimeout(() => {
            const active = document.activeElement;
            if (active?.id !== "bet") {
                setShowKeyboard(false);
                setFocusedField(null);
            }
        }, 100);
    };

    return (
        <div className="container">
            <div className="top-bar">
                <button className="back-button" onClick={() => navigate('/gameoverview')}>
                    Zurück
                </button>
                <button className="info-button-2" onClick={() => navigate('/gameoverview/horserace/info')}>         
                    <MdInfo />
                </button>
            </div>

            <h1 className="titel">Pferderennen</h1>

            <div className="balance-area">
                Dein Guthaben: <strong>{coinsBalance}</strong>
                <img src={coinImg} alt="Münze" className="coin-small" />
            </div>

            <div className="bet-area">
                <label>
                    Einsatz:
                    <input
                        id="bet"
                        type="text"
                        value={bet}
                        readOnly
                        onFocus={() => {
                            setFocusedField("bet");
                            setShowKeyboard(true);
                        }}
                        onBlur={handleBlur}
                        placeholder="Einsatz eingeben"
                    />
                </label>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>

            {showKeyboard && (
                <div className="virtual-keyboardNumber">
                    <VirtualKeyboard
                        onKeyPress={handleKeyPress}
                        onBackspace={handleBackspace}
                        onClose={handleCloseKeyboard}
                    />
                </div>
            )}

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
