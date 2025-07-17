import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function EditProfile() {

    const navigate = useNavigate();

    const currentToken = sessionStorage.getItem("authToken");

    const [playerId, setPlayerId] = useState(0);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [coins, setCoins] = useState(0);

    useEffect(() => {
        if (!currentToken) {
            alert("Du bist noch gar nicht eingeloggt!");
            navigate("/");
            return;
        }
    })

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
                setUsername(data.username);
                setEmail(data.email);
                setCoins(data.coins);

            } catch (err) {
                console.error("Fehler bei dem Bekommen der SpielerId:", err);
            }
        };

        fetchPlayerId();
    }, [currentToken]);

    const [errorMsg, setErrorMsg] = useState("");

    const editProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(""); // Vorherige Fehlermeldungen löschen

        try {
            const res = await fetch(`http://localhost:8080/api/players/${playerId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${currentToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password, coins }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                if (res.status === 409) {
                    setErrorMsg(errorText); // kommt vom Backend: z. B. "Username existiert bereits"
                } else {
                    setErrorMsg("Fehler beim Bearbeiten: " + errorText);
                }
                return;
            }

            navigate("/gameoverview");

        } catch (err) {
            console.error("Serverfehler:", err);
            setErrorMsg("Verbindung zum Server fehlgeschlagen.");
        }
    };


    const handleDeleteProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:8080/api/players/${playerId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${currentToken}`,
                    "Content-Type": "application/json"
                }
            });
            if (!res) {
                console.log("Fehler beim Löschen!")
            }
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <h1>Mein Profil</h1>
            <form className="register-form" onSubmit={editProfile}>
                <label htmlFor="username" className="form-label">Benutzername</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    placeholder={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <label htmlFor="email" className="form-label">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    placeholder={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <label htmlFor="password" className="form-label">Passwort</label>
                <div style={{ width: "100%" }}>
                    <input
                        id="password"
                        type={"password"}
                        value={password}
                        placeholder="Gib dein neues Passwort hier ein"
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                {errorMsg && <p className="error-message" role="alert">{errorMsg}</p>}
                <button className="next-btn" type="submit">Änderungen speichern</button>
                <button className="next-btn" onClick={handleDeleteProfile}>Profil löschen</button>
                <button
                    className="next-btn"
                    type="button"
                    onClick={() => navigate('/gameoverview')}
                >
                    Zurück
                </button>
            </form>
        </>
    );
}