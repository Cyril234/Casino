import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import '../../styles/HorseRaceBet.css';
import coinImg from "../../../public/pokergeld.png";
import { MdInfo } from "react-icons/md";

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
    blitz,
    donner,
    eis,
    feuer,
    glanz,
    pfeil,
    schatten,
    sturm,
    tornado,
    wirbel
};

export default function HorseRace() {
    interface Horse {
        horseId: number;
        name: string;
        winningProbability: number;
        multiplicationfactor: number;
        description: string;
    }

    const navigate = useNavigate();
    const token = sessionStorage.getItem("authToken");
    const [playerId, setPlayerId] = useState(0);
    const [bet, setBet] = useState(0);
    const [horseId, setHorseId] = useState(0);
    const [winnerHorse, setWinnerHorse] = useState<Horse | null>(null);
    const [allHorses, setAllHorses] = useState<Horse[]>();
    const [coinsBalance, setCoinsBalance] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [horseIndex, setHorseIndex] = useState(0);

    useEffect(() => {
        if (!token) navigate("/");
    }, [token, navigate]);

    useEffect(() => {
        fetchPlayerData();
        fetchHorses();
    }, [token]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!allHorses) return;
            if (e.key === "ArrowRight") {
                setHorseIndex(prev => (prev + 1) % allHorses.length);
            } else if (e.key === "ArrowLeft") {
                setHorseIndex(prev => (prev - 1 + allHorses.length) % allHorses.length);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [allHorses]);

    const fetchPlayerData = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/players/byToken/${token}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setPlayerId(data.playerId);
            setCoinsBalance(data.coins);
        } catch (err) {
            console.error("Fehler beim Laden des Spielers:", err);
        }
    };

    const fetchHorses = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/horserace/horses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setAllHorses(data);
        } catch (err) {
            console.error("Fehler beim Laden der Pferde:", err);
        }
    };

    const getWinner = async (selectedHorseId: number) => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/horserace/${playerId}/result?horseId=${selectedHorseId}&coins=${bet}`,
                { method: "POST", headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setWinnerHorse(data);
            await fetchPlayerData();
        } catch (err) {
            console.error("Fehler beim Abrufen des Gewinnerpferdes:", err);
        }
    };

    const handleHorseSelection = async (selectedId: number) => {
        setHorseId(selectedId);
        setWinnerHorse(null);
        await startGame(selectedId);
    };

    const startGame = async (selectedHorseId: number) => {
        if (bet <= 0 || selectedHorseId === 0 || isProcessing || bet > coinsBalance) return;

        setIsProcessing(true);
        setErrorMessage("");

        try {
            const res = await fetch(
                `http://localhost:8080/api/horserace/${playerId}/startgame?horseId=${selectedHorseId}&coins=${bet}`,
                { method: "POST", headers: { Authorization: `Bearer ${token}` } }
            );

            if (!res.ok) {
                const text = await res.text();
                if (text.includes("Nicht genügend Coins")) {
                    setErrorMessage("Nicht genügend Coins für diese Wette.");
                } else {
                    setErrorMessage("Ein Fehler ist aufgetreten.");
                }
                return;
            }

            await getWinner(selectedHorseId);
        } catch (err) {
            setErrorMessage("Fehler beim Starten des Spiels.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleInfo = () => navigate("/gameoverview/horserace/info");
    const handleBack = () => navigate("/gameoverview");

    const disableButtons = bet <= 0 || bet > coinsBalance || isProcessing;

    const getHorseImage = (horse: Horse) => {
        const key = horse.name.toLowerCase();
        return horseImages[key] || blitz;
    };

    return (
        <div className="container">
            <div className="top-bar">
                <button className="nav-button" onClick={handleBack}>Zurück</button>
                <button className="nav-button" onClick={handleInfo}><MdInfo /></button>
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
                        onChange={e => setBet(parseInt(e.target.value) || 0)}
                    />
                </label>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>

            {allHorses && allHorses.length > 0 && (
                <div className="horse-slider-container">
                    <div className="horse-card large">
                        <img
                            src={getHorseImage(allHorses[horseIndex])}
                            alt={allHorses[horseIndex].name}
                            className="horse-image"
                        />
                        <h2>{allHorses[horseIndex].name}</h2>
                        <p>Gewinnchance: {Math.round(allHorses[horseIndex].winningProbability * 100)}%</p>
                        <p>Multiplikator: {allHorses[horseIndex].multiplicationfactor}x</p>
                        <p>{allHorses[horseIndex].description}</p>
                        <button
                            className="select-button"
                            onClick={() => handleHorseSelection(allHorses[horseIndex].horseId)}
                            disabled={disableButtons}
                        >
                            Wette auf {allHorses[horseIndex].name}
                        </button>
                    </div>
                    <div className="slider-indicator">
                        {horseIndex + 1} / {allHorses.length}
                    </div>
                </div>
            )}

            {winnerHorse && (
                <div className="winner-announcement">
                    <h2>Siegerpferd: {winnerHorse.name}</h2>
                    {winnerHorse.horseId === horseId ? (
                        <p className="won-text">Du hast gewonnen!</p>
                    ) : (
                        <p className="lost-text">Du hast verloren.</p>
                    )}
                </div>
            )}
        </div>
    );
}
