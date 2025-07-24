import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "../../styles/EditProfile.css";
import { useBadgeScanner } from "./AddBadge";
import VirtualKeyboard from "../../Keyboard/Virtual_Keyboard";

export default function EditProfile() {

    const navigate = useNavigate();

    const currentToken = sessionStorage.getItem("authToken");
    const usernameSecurity = sessionStorage.getItem("username");

    const [playerId, setPlayerId] = useState(0);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState<string | undefined>();
    const [coins, setCoins] = useState(0);
    const [badgenumber, setBadgenumber] = useState<string | null>(null);

    const [activeInput, setActiveInput] = useState<"username" | "email" | "password" | null>(null);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!currentToken) {
            alert("Du bist noch gar nicht eingeloggt!");
            navigate("/");
            return;
        }
        if (!usernameSecurity) {
            navigate("/gameoverview");
        }
    }, [currentToken, usernameSecurity, navigate]);

    useEffect(() => {
        const fetchPlayerData = async () => {
            if (!currentToken) return;

            try {
                const res = await fetch(`http://localhost:8080/api/players/byToken/${currentToken}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${currentToken}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) throw new Error(`HTTP Fehler: ${res.status}`);

                const data = await res.json();
                setPlayerId(data.playerId);
                setUsername(data.username);
                setEmail(data.email);
                setCoins(data.coins);
                setBadgenumber(data.badgenumber);

            } catch (err) {
                console.error("Fehler beim Laden der Spielerdaten:", err);
            }
        };

        fetchPlayerData();
    }, [currentToken]);

    const editProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        const updateData: any = {
            username,
            email,
            coins,
            badgenumber
        };

        if (password && password.trim() !== "") {
            updateData.password = password;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/players/${playerId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${currentToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updateData),
            });

            if (!res.ok) {
                const errorText = await res.text();
                setErrorMsg(res.status === 409 ? errorText : "Fehler beim Bearbeiten: " + errorText);
                return;
            }

            sessionStorage.setItem("username", username);
            navigate("/gameoverview");

        } catch (err) {
            console.error("Serverfehler:", err);
            setErrorMsg("Verbindung zum Server fehlgeschlagen.");
        }
    };

    useBadgeScanner(async (scan) => {
        const match = scan.match(/UID:(.*?);/);
        if (match) {
            const scannedBadge = match[1];
            if (!currentToken || !playerId) return;

            try {
                const res = await fetch(`http://localhost:8080/api/players/badge/${playerId}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${currentToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ badgenumber: scannedBadge }),
                });

                if (res.ok) {
                    setBadgenumber(scannedBadge);
                } else {
                    const errorText = await res.text();
                    setErrorMsg(res.status === 409 ? errorText : "Fehler beim Badge-Speichern: " + errorText);
                }
            } catch (err) {
                console.error("Fehler beim automatischen Badge-Speichern:", err);
            }
        }
    });

    const handleBadgeClick = async () => {
        if (!currentToken || !playerId) return;

        try {
            const res = await fetch(`http://localhost:8080/api/players/${playerId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${currentToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ badgenumber: null }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                setErrorMsg(res.status === 409 ? errorText : "Fehler beim Badge-Löschen: " + errorText);
                return;
            }

            setBadgenumber(null);
            sessionStorage.setItem("username", username);
            navigate("/gameoverview");

        } catch (err) {
            console.error("Serverfehler:", err);
            setErrorMsg("Verbindung zum Server fehlgeschlagen.");
        }
    };

    const handleDeleteProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch(`http://localhost:8080/api/players/${playerId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${currentToken}`,
                    "Content-Type": "application/json"
                }
            });
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    const onKeyPress = (key: string) => {
        if (!activeInput) return;

        const updater = (old: string) => {
            if (key === "⌫") return old.slice(0, -1);
            if (key === "✖") {
                setKeyboardVisible(false);
                return old;
            }
            return old + key;
        };

        if (activeInput === "username") setUsername(updater);
        if (activeInput === "email") setEmail(updater);
        if (activeInput === "password") setPassword(prev => updater(prev ?? ""));
    };

    const onInputBlur = () => {
        setKeyboardVisible(false);
        setActiveInput(null);
    };

    return (
        <div className="page-wrapper">
            <h1>Mein Profil</h1>
            <form className="register-form" onSubmit={editProfile}>

                <label htmlFor="username" className="form-label">Benutzername</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    placeholder={username}
                    onChange={e => setUsername(e.target.value)}
                    onFocus={() => { setActiveInput("username"); setKeyboardVisible(true) }}
                    onBlur={onInputBlur}
                />

                <label htmlFor="email" className="form-label">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    placeholder={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => { setActiveInput("email"); setKeyboardVisible(true) }}
                    onBlur={onInputBlur}
                />

                <label htmlFor="password" className="form-label">Passwort</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="Gib dein neues Passwort hier ein"
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => { setActiveInput("password"); setKeyboardVisible(true) }}
                    onBlur={onInputBlur}
                />

                <p className="badge-status">
                    {badgenumber === null
                        ? "Im Moment ist noch kein Badge mit deinem Konto verknüpft... Scanne deinen Badge am leser, um ihn mit deinem Account zu verknüpfen!"
                        : "Es ist bereits ein Badge ist mit deinem Konto verknüpft! Du kannst dich mit deinem Badge anmelden."}
                </p>

                {badgenumber !== null && (
                    <button
                        className="next-btn"
                        type="button"
                        onClick={handleBadgeClick}
                    >
                        Badge von Konto lösen
                    </button>
                )}

                {errorMsg && <p className="error-message" role="alert">{errorMsg}</p>}
                <button className="next-btn" type="submit">Änderungen speichern</button>
                <button className="next-btn" onClick={handleDeleteProfile}>Mein Profil löschen</button>
                <button className="next-btn" type="button" onClick={() => navigate('/gameoverview')}>Zurück zur Übersicht</button>
            </form>

            {keyboardVisible && <VirtualKeyboard onKeyPress={onKeyPress} onBackspace={() => onKeyPress("⌫")} onClose={() => setKeyboardVisible(false)} />}
        </div>
    );
}
