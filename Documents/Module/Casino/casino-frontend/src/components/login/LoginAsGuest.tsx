import { useNavigate } from "react-router";

export default function LoginAsGuest() {
    const navigate = useNavigate();

    const goToGameoverview = () => navigate('/gameoverview');

    return (
        <>
            <div>
                <h1>Login als Gast</h1>
                <p>Verwende fast alle Funktionen, ohne ein Konto zu erstellen! Du erhälst einen Startbetrag, welchen du verspielen kannst!</p>
                <button onClick={goToGameoverview}>Als Gast fortfahren</button>
            </div>
        </>
    )

}