import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

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
    const [gameTitles, setGameTitles] = useState<Map<number, string>>(new Map());

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

    useEffect(() => {
        if (playingAttempts) {
            const uniqueGameIds = [...new Set(playingAttempts.map(pa => pa.game.gameId))];
            uniqueGameIds.forEach(id => {
                if (!gameTitles.has(id)) {
                    fetchGameData(id);
                }
            });
        }
    }, [playingAttempts]);

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

    const fetchGameData = async (gameId: number) => {
        try {
            const res = await fetch(`http://localhost:8080/api/games/${gameId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setGameTitles(prev => new Map(prev).set(gameId, data.title));
        } catch (err) {
            console.error(`Fehler beim Laden des Spiels mit ID ${gameId}:`, err);
        }
    };

    return (
        <div id="mygames-wrapper">
            <h1 className="mygames-title">Meine letzten Spiele</h1>

            <div id="games-scroll-area" className="games-scroll-container">
                {playingAttempts && playingAttempts.length > 0 ? (
                    playingAttempts.map((attempt) => (
                        <div key={attempt.playingAttemptId} className="game-entry">
                            <p className="game-title">
                                Spiel: {attempt.game.title}
                            </p>
                            <p className="game-coins">Einsatz: {attempt.settedcoins} Coins</p>
                            <p className="game-date">Datum: {new Date(attempt.date).toLocaleString()}</p>
                            <p className="game-date">Schlussbilanz: {attempt.finishingbalance}</p>

                        </div>
                    ))
                ) : (
                    <p className="no-games-text">Keine Spielversuche gefunden.</p>
                )}
            </div>
            <button onClick={() => navigate("/gameoverview")}>Züruck</button>
        </div>
    );
}
