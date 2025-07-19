import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import '../../styles/MyGames.css';

export default function MyGames() {
    interface PlayingAttempt {
        playingAttemptId: number;
        date: Date;
        settedcoins: number;
        finishingbalance: number;
        game: {
            gameId: number;
            title: string;
        };
    }

    const token = sessionStorage.getItem("authToken");
    const usernameSecurity = sessionStorage.getItem("username");
    const navigate = useNavigate();

    const [playerId, setPlayerId] = useState<number | undefined>(undefined);
    const [playingAttempts, setPlayingAttempts] = useState<PlayingAttempt[] | undefined>(undefined);

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
        if (!usernameSecurity) {
            navigate("/gameoverview");
        } else {
            fetchPlayerData();
        }
    }, [token]);

    useEffect(() => {
        if (playerId !== undefined) {
            fetchPlayingAttempts();
        }
    }, [playerId]);

    const fetchPlayerData = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/players/byToken/${token}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setPlayerId(data.playerId);
        } catch (err) {
            console.error("Fehler beim Laden des Spielers:", err);
        }
    };

    const fetchPlayingAttempts = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/playingattempts/byPlayer/${playerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setPlayingAttempts(data);
        } catch (err) {
            console.error("Fehler beim Laden der Spielversuche:", err);
        }
    };

    const sortedAttempts = playingAttempts
        ? [...playingAttempts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        : [];

    return (
        <div id="mygames-wrapper">
            <button className="back-button" onClick={() => navigate("/gameoverview")}>Zurück</button>
            <h1 className="mygames-title">Meine letzten Spiele</h1>

            <div className="games-scroll-container">
                {sortedAttempts.length > 0 ? (
                    sortedAttempts.map((attempt) => (
                        <div key={attempt.playingAttemptId} className="game-entry">
                            <p className="game-title">Spiel: {attempt.game.title}</p>
                            <p className="game-coins">Einsatz: {attempt.settedcoins} Coins</p>
                            <p className="game-date">Datum: {new Date(attempt.date).toLocaleString()}</p>
                            <p className="game-date">Schlussbilanz: {attempt.finishingbalance}</p>
                        </div>
                    ))
                ) : (
                    <p className="no-games-text">Keine Spielversuche gefunden.</p>
                )}
            </div>
        </div>
    );
}
