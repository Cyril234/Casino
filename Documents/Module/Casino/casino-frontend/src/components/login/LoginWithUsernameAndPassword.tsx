import { useState } from "react";
import { useNavigate } from "react-router";
import '../../styles/LoginWithUsernameAndPassword.css';

const keys = [
  "Q","W","E","R","T","Z","U","I","O","P",
  "A","S","D","F","G","H","J","K","L",
  "Y","X","C","V","B","N","M"
];

export default function LoginWithEmailAndPassword() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [focusedField, setFocusedField] = useState<"username" | "password" | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        setErrorMsg(errorText);
        return;
      }

      const { token } = await res.json();
      if (!token) throw new Error("Kein Token erhalten");

      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("username", username);
      setStatus("Erfolgreich angemeldet");
      navigate("/gameoverview");
    } catch (err) {
      if (err instanceof Error) setStatus(err.message);
      else setStatus("Anmeldung fehlgeschlagen");
      console.error(err);
    }
  };

  function onFocusField(field: "username" | "password") {
    setFocusedField(field);
    setShowKeyboard(true);
  }

  function onKeyPress(key: string) {
    if (focusedField === "username") {
      setUsername(prev => prev + key);
    } else if (focusedField === "password") {
      setPassword(prev => prev + key);
    }
  }

  function onBackspace() {
    if (focusedField === "username") {
      setUsername(prev => prev.slice(0, -1));
    } else if (focusedField === "password") {
      setPassword(prev => prev.slice(0, -1));
    }
  }

  return (
    <main className="casino-login-container">
      <section className="casino-login-card">
        <h1 className="casino-login-title">Anmelden</h1>
        <form onSubmit={handleLogin} className="casino-login-form">
          <label htmlFor="username" className="casino-login-label">Benutzername</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onFocus={() => onFocusField("username")}
            required
            className="casino-login-input"
            autoComplete="off"
          />

          <label htmlFor="password" className="casino-login-label">Passwort</label>
          <input
            id="password"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => onFocusField("password")}
            required
            className="casino-login-input"
            autoComplete="off"
          />
          <button
            type="button"
            className="casino-login-button casino-login-button--toggle"
            onClick={() => setShowPw(prev => !prev)}
          >
            {showPw ? "Verbergen" : "Anzeigen"}
          </button>
          {errorMsg && <p className="register-error">{errorMsg}</p>}
          <div className="casino-login-buttons">
            <button className="casino-login-button" type="submit">Anmelden</button>
            <button
              className="casino-login-button casino-login-button--back"
              type="button"
              onClick={() => navigate('/login-overview')}
            >
              Zurück
            </button>
          </div>
        </form>

        {/* Virtuelle Tastatur */}
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
