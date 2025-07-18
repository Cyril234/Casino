import { useState } from "react";
import { useNavigate } from "react-router";
import '../../styles/LoginWithUsernameAndPassword.css';

export default function LoginWithEmailAndPassword() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

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
      setStatus("Erfolgreich angemeldet ✅");
      navigate("/gameoverview");
    } catch (err) {
      if (err instanceof Error) setStatus(err.message);
      else setStatus("Anmeldung fehlgeschlagen ❌");
      console.error(err);
    }
  };

  return (
    <>
      <main className="register-page">
        <h1 className="register-title">Anmelden</h1>
        <form className="register-form" onSubmit={handleLogin}>
          <label htmlFor="username" className="form-label">Benutzername</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: "97%" }}
          />

          <label htmlFor="password" className="form-label">Passwort</label>
          <div style={{ width: "100%" }}>
            <input
              id="password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: "96%" }}
            />
            <button
              type="button"
              className="start-btn"
              style={{ width: "100%", marginTop: "0.5rem", padding: "0.7rem 1rem" }}
              onClick={() => setShowPw((v) => !v)}
            >
              {showPw ? "Verbergen" : "Anzeigen"}
            </button>
          </div>
          {errorMsg && (
            <p className="error-message" role="alert">{errorMsg}</p>
          )}
          <button className="next-btn" type="submit">Anmelden</button>
          <button
            className="next-btn"
            type="button"
            style={{ marginTop: "1rem" }}
            onClick={() => navigate('/login-overview')}
          >
            Zurück
          </button>
        </form>
      </main>
    </>
  );
}

