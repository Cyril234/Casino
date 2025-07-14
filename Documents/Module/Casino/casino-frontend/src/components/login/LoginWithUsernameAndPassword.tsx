import { useState } from "react";
import { useNavigate } from "react-router";

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
      navigate("/game-overview");
    } catch (err) {
      if (err instanceof Error) setStatus(err.message);
      else setStatus("Anmeldung fehlgeschlagen ❌");
      console.error(err);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Benutzername:</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
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
            onClick={() => setShowPw(!showPw)}
            style={{ marginLeft: "0.5rem" }}
          >
            {showPw ? "Verbergen" : "Anzeigen"}
          </button>
        </div>

        <button type="submit">Anmelden</button>
      </form>

      {status && <p>{status}</p>}
    </>
  );
}
