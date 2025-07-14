import { useNavigate } from 'react-router';
import '../../styles/Loginoverview.css';

export default function Loginoverview() {
    const navigate = useNavigate();

    const goToEmailPwd = () => navigate('/login-with-email-and-password');
    const goToBadge = () => navigate('/login-with-badge');
    const goToGuest = () => navigate('/login-as-guest');

    return (
        <div id="login-container">
            <h1 id="login-title">Anmeldevariante wählen...</h1>
            <div id="button-group">
                <button id="email-login" className="casino-button" onClick={goToEmailPwd}>
                    Anmeldung mit Email und Passwort
                </button>

                <button id="badge-login" className="casino-button" onClick={goToBadge}>
                    Anmeldung mit Badge
                </button>

                <button id="guest-login" className="casino-button" onClick={goToGuest}>
                    Anmeldung als Gast
                </button>
            </div>
        </div>
    );
}
