import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PlayerDto {
  id: number;
  username: string;
  email: string;
  password: string;
}

interface TokenResponse {
  token: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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

      if (!regRes.ok) throw new Error(await regRes.text());
      const newPlayer: PlayerDto = await regRes.json();

      const loginRes = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!loginRes.ok) throw new Error(await loginRes.text());
      const { token }: TokenResponse = await loginRes.json();
      sessionStorage.setItem("authToken", token);

      navigate("/create-avatar", {
        state: { player: newPlayer }
      });

    } catch (error: any) {
      console.error("Registrierung oder Login fehlgeschlagen:", error);
      setErrorMsg("Registrierung oder Login fehlgeschlagen. Bitte überprüfe deine Eingaben.");
    }
  };

  return (
    <main className="register-page">
      <h1 className="register-title">Registrieren</h1>
      <form className="register-form" onSubmit={handleNext}>
        <label htmlFor="username" className="form-label">Username</label>
        <input
          id="username"
          className="form-input"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <label htmlFor="email" className="form-label">E-Mail</label>
        <input
          id="email"
          className="form-input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password" className="form-label">Passwort</label>
        <input
          id="password"
          className="form-input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {errorMsg && <p className="error-message" role="alert">{errorMsg}</p>}

        <button className="next-btn" type="submit">Weiter</button>
      </form>
    </main>
  );
}
