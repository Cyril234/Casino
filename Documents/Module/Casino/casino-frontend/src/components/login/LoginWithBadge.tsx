import { useNavigate } from 'react-router';
import '../../styles/LoginWithBadge.css';
import { useCallback } from 'react';
import { useBadgeScanner } from './LoginBage';

export default function LoginWithBadge() {
  const navigate = useNavigate();

  if (sessionStorage.getItem("authToken")) {
    sessionStorage.removeItem("authToken");
  }
  if (sessionStorage.getItem("username")) {
    sessionStorage.removeItem("username");
  }

  const handleBadgeScan = useCallback(async (scan: string) => {
    try {
      const res = await fetch("http://localhost:8080/api/loginUID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ uid: scan }),
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem("authToken", data.token);

        if (data.token && data.token !== "") {
          const username = data.username;
          sessionStorage.setItem("username", username);

          if (
            username ===
            "supergeheim!ZurSicherheit_1234_geheim_sodass_niemand_unberechtigtes_auf_diese_Seite_zugreiffen_kann_1267"
          ) {
            navigate("/form-after-login-with-badge");
          } else {
            navigate("/gameoverview");
          }
        } else {
          navigate("/form-after-login-with-badge");
        }
      } else {
        navigate("/form-after-login-with-badge");
      }
    } catch (err) {
      console.error("Verbindungsfehler:", err);
    }
  }, [navigate]);

  useBadgeScanner(handleBadgeScan);

  return (
    <>
      <div className="unique-register-container">
        <div className="unique-register-card full-width">
          <h1 className="unique-register-title">Badge-Login</h1>
          <p className="unique-register-desc">
            Halte deinen Badge an den Leser am Automaten, um dich anzumelden oder zu registrieren!
          </p>
          <button
            className="unique-register-button"
            onClick={() => navigate('/login-overview')}
          >
            Zurück
          </button>
        </div>
      </div>
    </>
  );
}
