import { useState } from "react";
import { useNavigate } from "react-router";
import '../../styles/LoginWithUsernameAndPassword.css';

export default function LoginWithEmailAndPassword() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Ungültige Anmeldedaten");
      const { token } = await res.json();
      if (!token) throw new Error("Kein Token erhalten");

      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("username", username);
      setStatus("Erfolgreich angemeldet ✅");
      navigate("/gameoverview");
    } catch (err) {
      if (err instanceof Error) setStatus(err.message);
      else setStatus("Anmeldung fehlgeschlagen ❌");
      console.error(err);
    }
  };

  return (
    <div className="start-container">
      <div className="start-card">

        <div className="login-header">Login</div>
        <div className="login-divider" />
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-group">
            <label htmlFor="username">Benutzername:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="login-group">
            <label htmlFor="password">Passwort:</label>
            <input
              type={showPw ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="start-btn"
              onClick={() => setShowPw(!showPw)}
              style={{ marginLeft: "0.5rem" }}
            >
              {showPw ? "Verbergen" : "Anzeigen"}
            </button>

          </div>

          <div className="login-buttons">
            <button type="submit" className="start-btn">Anmelden</button>
            <button className="start-btn" onClick={() => navigate('/login-overview')}>Zurück</button>
          </div>
        </form>
        {status && <div className="login-status">{status}</div>}
      </div>
    </div>
  );
}

