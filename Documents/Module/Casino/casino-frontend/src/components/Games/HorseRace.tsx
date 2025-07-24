import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/HorseRaceBet.css';
import coinImg from '../../../public/pokergeld.png';
import { MdInfo } from 'react-icons/md';
import sounds from "../litleThings/Sounds";

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

type LocationState = {
    horseIndex: number;
    bet: number;
    playerId: number;
    winnerHorseId?: number;
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
    }, [navigate, , location.key]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                setHorseIndex(prev => (prev + 1) % allHorses.length);
            } else if (e.key === 'ArrowLeft') {
                setHorseIndex(prev => (prev - 1 + allHorses.length) % allHorses.length);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [allHorses]);

    useEffect(() => {
        if (!token) return;
        const handleSound = async () => {
            if (soundstatus && volume > 0) {
                await sounds.play("blackjackmusic.wav", true, 0.4);
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
            state: { horseIndex, bet, playerId, },
        });
    };

    return (
        <div className="container">
            <div className="top-bar">
                <button className="back-button" onClick={() => navigate('/gameoverview')}>
                    Zurück
                </button>
                <div className="info-button-2" onClick={() => navigate('/gameoverview/horserace/info')}>
                    <MdInfo />
                </div>
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
