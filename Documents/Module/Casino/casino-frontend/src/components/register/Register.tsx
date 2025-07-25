import { useEffect, useState } from "react";
import "../../styles/Register.css";
import { useNavigate } from "react-router-dom";
import sounds from "../litleThings/Sounds";

interface PlayerDto {
  id: number;
  username: string;
  email: string;
  password: string;
}

interface TokenResponse {
  token: string;
}

const keys = [
  "Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P",
  "A", "S", "D", "F", "G", "H", "J", "K", "L",
  "Y", "X", "C", "V", "B", "N", "M",
  "@"
];

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [focusedField, setFocusedField] = useState<"username" | "email" | "password" | null>(null);

  useEffect(() => {
    sounds.stop("casinomusic.mp3");
    sounds.stop("blackjackmusic.wav");
    sounds.stop("horseracemusic.wav");
    sounds.stop("minesmusic.wav");
    sounds.stop("roulettemusic.wav");
    sounds.stop("slotmusic.wav");
  }, []);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const regRes = await fetch("http://localhost:8080/api/players/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ username, email, password })
      });

      if (!regRes.ok) {
        const errorText = await regRes.text();

        if (regRes.status === 409) {
          if (errorText.includes("E-Mail")) {
            setErrorMsg("Diese E-Mail-Adresse ist bereits registriert.");
          } else if (errorText.includes("Benutzername") || errorText.includes("Username")) {
            setErrorMsg("Dieser Benutzername ist bereits vergeben.");
          } else {
            setErrorMsg("Registrierung fehlgeschlagen: " + errorText);
          }
        } else {
          setErrorMsg("Registrierung fehlgeschlagen: " + errorText);
        }
        return;
      }

      const newPlayer: PlayerDto = await regRes.json();

      const loginRes = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!loginRes.ok) {
        const loginErrorText = await loginRes.text();
        setErrorMsg("Login fehlgeschlagen: " + loginErrorText);
        return;
      }

      const { token }: TokenResponse = await loginRes.json();
      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("username", username);

      navigate("/create-avatar", {
        state: { player: newPlayer }
      });

    } catch (error: any) {
      console.error("Registrierung oder Login fehlgeschlagen:", error);
      setErrorMsg("Serverfehler. Bitte versuche es später erneut.");
    }
  };

  function onFocusField(field: "username" | "email" | "password") {
    setFocusedField(field);
    setShowKeyboard(true);
  }

  function onBlurField() {
    setTimeout(() => {
      const active = document.activeElement;
      const allowedIds = ["username", "email", "password"];
      if (!(active instanceof HTMLElement) || !allowedIds.includes(active.id)) {
        setShowKeyboard(false);
        setFocusedField(null);
      }
    }, 100);
  }

  function onKeyPress(key: string) {
    if (focusedField === "username") {
      setUsername(prev => prev + key);
    } else if (focusedField === "email") {
      setEmail(prev => prev + key);
    } else if (focusedField === "password") {
      setPassword(prev => prev + key);
    }
  }

  function onBackspace() {
    if (focusedField === "username") {
      setUsername(prev => prev.slice(0, -1));
    } else if (focusedField === "email") {
      setEmail(prev => prev.slice(0, -1));
    } else if (focusedField === "password") {
      setPassword(prev => prev.slice(0, -1));
    }
  }

  return (
    <main className="register-page-container">
      <section className="register-form-wrapper">
        <h1 className="register-title">Registrieren</h1>
        <form className="register-form" onSubmit={handleNext}>

          <label htmlFor="username" className="register-label">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onFocus={() => onFocusField("username")}
            onBlur={onBlurField}
            required
            className="register-input"
            autoComplete="off"
          />

          <label htmlFor="email" className="register-label">E-Mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => onFocusField("email")}
            onBlur={onBlurField}
            required
            className="register-input"
            autoComplete="off"
          />

          <label htmlFor="password" className="register-label">Passwort</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => onFocusField("password")}
              onBlur={onBlurField}
              required
              className="register-input"
              autoComplete="off"
            />
            <button
              type="button"
              className="casino-login-button casino-login-button--toggle"
              onClick={() => setShowPw(prev => !prev)}
            >
              {showPw ? "Verbergen" : "Anzeigen"}
            </button>
          </div>

          {errorMsg && <p className="register-error">{errorMsg}</p>}

          <button className="register-button" type="submit">Weiter</button>
          <button
            className="register-button register-button-back"
            type="button"
            onClick={() => navigate('/login-overview')}
          >
            Zurück
          </button>
        </form>

        {showKeyboard && (
          <div className="virtual-keyboard">
            <div className="keyboard-keys">
              {keys.map(key => (
                <button
                  key={key}
                  type="button"
                  className="keyboard-key"
                  onClick={() => onKeyPress(key)}
                >
                  {key}
                </button>
              ))}
              <button
                type="button"
                className="keyboard-key keyboard-backspace"
                onClick={onBackspace}
              >
                ⌫
              </button>
              <button
                type="button"
                className="keyboard-key keyboard-close"
                onClick={() => setShowKeyboard(false)}
              >
                ✖
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
