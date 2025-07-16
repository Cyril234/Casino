import { useNavigate } from "react-router";

export default function LoginAsGuest() {

    const navigate = useNavigate();


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
        <div className="start-container">
            <div className="start-card">
                <div className="start-title">Anmeldung als Gast</div>
                <div className="start-desc">Verwende fast alle Funktionen, ohne ein Konto zu erstellen! Du erhälst einen Startbetrag, welchen du verspielen kannst!</div>
                <button className="start-btn" onClick={goToGameoverview}>Als Gast fortfahren</button>
                <button className="start-btn" onClick={() => navigate('/login-overview')}>Zurück</button>
            </div>
        </div>
    )

}