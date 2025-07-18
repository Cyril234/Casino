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
<main className="casino-login-container">
  <section className="casino-login-card">
    <h1 className="casino-login-title">Anmelden</h1>
    <form onSubmit={handleLogin} className="casino-login-form">
      
     

      {/* Benutzername */}
      <label htmlFor="username" className="casino-login-label">Benutzername</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        className="casino-login-input"
      />

      {/* Passwort */}
      <label htmlFor="password" className="casino-login-label">Passwort</label>
      <input
        id="password"
        type={showPw ? "text" : "password"}
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="casino-login-input"
      />
       {/* Anzeigen-Button ganz oben */}
      <button
        type="button"
        className="casino-login-button casino-login-button--toggle"
        onClick={() => setShowPw(prev => !prev)}
      >
        {showPw ? "Verbergen" : "Anzeigen"}
      </button>

      {/* Buttons zentriert */}
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
  </section>
</main>



);


}

