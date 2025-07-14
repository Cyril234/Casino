import { useNavigate } from 'react-router';
import '../../styles/Loginoverview.css';

export default function Loginoverview() {
    const navigate = useNavigate();

    const goToEmailPwd = () => navigate('/login-with-email-and-password');
    const goToBadge = () => navigate('/login-with-badge');
    const goToGuest = () => navigate('/login-as-guest');
    const goToRegister = () => navigate('/register');

    return (
        <div className="start-container">
            <div className="start-card">
                <div className="login-header">Anmeldevariante wählen...</div>
                <div className="login-divider"></div>
                <div className="login-buttons">
                    <button className="start-btn" onClick={goToEmailPwd}>
                        Anmeldung mit Username und Passwort
                    </button>
                    <button className="start-btn" onClick={goToBadge}>
                        Anmeldung mit Badge
                    </button>
                    <button className="start-btn" onClick={goToGuest}>
                        Anmeldung als Gast
                    </button>
                    <button className='start-btn' onClick={goToRegister}>
                        Noch kein Konto? - Registrieren!
                    </button>
                </div>
            </div>
        </div>
    );
}
