import { useNavigate } from "react-router";
import "../../styles/LoginAsGuest.css"

export default function LoginAsGuest() {

  const navigate = useNavigate();

  if (sessionStorage.getItem("authToken")) {
    sessionStorage.removeItem("authToken");
  }
  if (sessionStorage.getItem("username")) {
    sessionStorage.removeItem("username");
  }

  async function goToGameoverview() {
    try {
      const response = await fetch("http://localhost:8080/api/loginAsGuest", {
        method: "POST"
      });

      const { token } = await response.json();

      if (response.ok) {
        sessionStorage.setItem("authToken", token);
        navigate("/gameoverview");
      } else {
        navigate("/")
      }

    } catch (error) {
      alert("Fehler beim Login als Gast!")
    }
  }



  return (
    <>
      <div className="guest-login-container">
        <div className="guest-login-card full-width">
          <h1 className="guest-login-title">Anmeldung als Gast</h1>
          <div className="guest-login-desc">
            Verwende fast alle Funktionen ...
          </div>
          <div className="guest-login-buttons">
            <button className="guest-login-button" onClick={goToGameoverview}>
              Als Gast fortfahren
            </button>
            <button
              className="guest-login-button"
              onClick={() => navigate('/login-overview')}
            >
              Zurück
            </button>
          </div>
        </div>
      </div>
    </>
  );


}