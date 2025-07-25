import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "../styles/Settings.css";

export default function Settings() {
    const [volume, setVolume] = useState(50);
    const [sound, setSound] = useState<boolean>(false); 
    const [playerId, setPlayerId] = useState<number | undefined>(undefined);
    const currentToken = sessionStorage.getItem("authToken");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlayerId = async () => {
            if (!currentToken) {
                console.error("Kein Auth-Token gefunden.");
                return;
            }

            try {
                const res = await fetch(`http://localhost:8080/api/players/byToken/${currentToken}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${currentToken}`,
                        Accept: "*/*",
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    throw new Error(`HTTP Fehler: ${res.status}`);
                }

                const data = await res.json();
                setPlayerId(data.playerId);
                setVolume(data.volume);
                setSound(data.soundstatus === "ON");

            } catch (err) {
                console.error("Fehler beim Abrufen der Spieler-ID:", err);
            }
        };

        fetchPlayerId();
    }, [currentToken]);

    async function saveSettings() {
        if (!playerId) {
            alert("Spieler-ID nicht verfügbar.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/players/settings/${playerId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${currentToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    soundstatus: sound ? "ON" : "OFF",
                    volume
                }),
            });

            if (response.ok) {
                navigate("/gameoverview");
            } else {
                alert("Serverfehler beim Speichern der Einstellungen.");
            }

        } catch (error) {
            alert("Fehler beim Ändern der Systemeinstellungen!");
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        saveSettings();
    };

    return (
        <div className="settings-wrapper">
            <h1>Einstellungen</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="volume">Lautstärke</label>
                <input
                    id="volume"
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                />
                <span>{volume}</span>

                <div className="toggle-wrapper">
                    <label htmlFor="sound">Sound</label>
                    <label className="switch">
                        <input
                            id="sound"
                            type="checkbox"
                            checked={sound}
                            onChange={(e) => setSound(e.target.checked)}
                        />
                        <span className="slider round"></span>
                    </label>
                    <span style={{ marginTop: 30 }}>{sound ? "An" : "Aus"}</span>
                </div>

                <button type="submit">Einstellungen speichern</button>
                <button type="button" onClick={() => navigate("/gameoverview")}>Abbrechen</button>
            </form>
        </div>
    );
}
