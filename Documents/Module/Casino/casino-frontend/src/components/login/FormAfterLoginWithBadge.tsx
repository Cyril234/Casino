import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "../../styles/FormAfterLoginWithBadge.css";
import sounds from "../litleThings/Sounds";
import VirtualKeyboard from "../../Keyboard/Virtual_Keyboard";

export default function FormAfterLoginWithBadge() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("authToken");

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [badgenumber, setBadgenumber] = useState<string>("");
    const [playerId, setPlayerId] = useState<number>(0);
    const [email, setEmail] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");

    const [showKeyboard, setShowKeyboard] = useState(false);
    const [focusedField, setFocusedField] = useState<"username" | "email" | "password" | null>(null);

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        sounds.stop("casinomusic.mp3");
        sounds.stop("blackjackmusic.wav");
        sounds.stop("horseracemusic.wav");
        sounds.stop("minesmusic.wav");
        sounds.stop("roulettemusic.wav");
        sounds.stop("slotmusic.wav");
    }, []);

    useEffect(() => {
        const fetchPlayerId = async () => {
            if (!token) return;

            try {
                const res = await fetch(`http://localhost:8080/api/players/byToken/${token}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        Accept: "*/*",
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) throw new Error(`HTTP Fehler: ${res.status}`);
                const data = await res.json();
                setPlayerId(data.playerId);
                setBadgenumber(data.badgenumber);
                sessionStorage.setItem("username", data.username);

                if (data.username !== "supergeheim!ZurSicherheit_1234_geheim_sodass_niemand_unberechtigtes_auf_diese_Seite_zugreiffen_kann_1267") {
                    navigate("/gameoverview");
                }

            } catch (err) {
                console.error("Fehler bei dem Bekommen der SpielerId:", err);
            }
        };

        fetchPlayerId();
    }, [token]);

    const onFocusField = (field: "username" | "email" | "password") => {
        setFocusedField(field);
        setShowKeyboard(true);
    };

    const onBlurField = () => {
        setTimeout(() => {
            const active = document.activeElement;
            if (!["username", "email", "password"].includes(active?.id || "")) {
                setShowKeyboard(false);
                setFocusedField(null);
            }
        }, 100);
    };

    const onKeyPress = (key: string) => {
        if (focusedField === "username") {
            setUsername(prev => prev + key);
        } else if (focusedField === "email") {
            setEmail(prev => prev + key);
        } else if (focusedField === "password") {
            setPassword(prev => prev + key);
        }
    };

    const onBackspace = () => {
        if (focusedField === "username") {
            setUsername(prev => prev.slice(0, -1));
        } else if (focusedField === "email") {
            setEmail(prev => prev.slice(0, -1));
        } else if (focusedField === "password") {
            setPassword(prev => prev.slice(0, -1));
        }
    };

    const cancel = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:8080/api/players/${playerId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!res.ok) {
                console.log("Fehler beim Löschen!");
            }
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    const createNewProfileWithBadge = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const res = await fetch(`http://localhost:8080/api/players/${playerId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password, badgenumber }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                if (res.status === 409) {
                    setErrorMsg(errorText);
                } else {
                    setErrorMsg("Fehler beim Erstellen: " + errorText);
                }
                return;
            }

            sessionStorage.setItem("username", username);
            navigate("/create-avatar-with-badge");

        } catch (err) {
            console.error("Serverfehler:", err);
            setErrorMsg("Verbindung zum Server fehlgeschlagen.");
        }
    };

    return (
        <>
            <div className="page-wrapper">
                <h1>Bitte fülle folgende Dinge aus, um dein Profil zu vervollständigen: </h1>
                <p>
                    Dieses Formular muss nur beim ersten Login mit dem Badge ausgefüllt werden. Danach funktioniert alles automatisch – du musst dir dein Passwort nicht mehr merken!
                </p>
                <form className="register-form" onSubmit={createNewProfileWithBadge}>
                    <label htmlFor="username" className="form-label">Benutzername</label>
                    <input
                        id="username"
                        type="text"
                        className="form-input"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        onFocus={() => onFocusField("username")}
                        onBlur={onBlurField}
                        autoComplete="off"
                        required
                    />

                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onFocus={() => onFocusField("email")}
                        onBlur={onBlurField}
                        autoComplete="off"
                        required
                    />

                    <label htmlFor="password" className="form-label">Passwort</label>
                    <input
                        id="password"
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onFocus={() => onFocusField("password")}
                        onBlur={onBlurField}
                        autoComplete="off"
                        required
                    />

                    {errorMsg && <p className="error-message" role="alert">{errorMsg}</p>}

                    <button className="next-btn" type="submit">Weiter</button>
                    <button className="next-btn" type="button" onClick={cancel}>Abbrechen</button>
                </form>

                {showKeyboard && (
                    <VirtualKeyboard
                        onKeyPress={onKeyPress}
                        onBackspace={onBackspace}
                        onClose={() => setShowKeyboard(false)}
                    />
                )}
            </div>
        </>
    );
}
