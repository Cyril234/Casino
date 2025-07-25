import { useNavigate } from 'react-router';
import '../../styles/Loginoverview.css';
import { useCallback, useEffect } from 'react';
import { useBadgeScanner } from './LoginBage';
import sounds from '../litleThings/Sounds';

export default function Loginoverview() {

    useEffect(() => {
        sounds.stop("casinomusic.mp3");
        sounds.stop("blackjackmusic.wav");
        sounds.stop("horseracemusic.wav");
        sounds.stop("minesmusic.wav");
        sounds.stop("roulettemusic.wav");
        sounds.stop("slotmusic.wav");
    });


    const navigate = useNavigate();

    const goToEmailPwd = () => navigate('/login-with-email-and-password');
    const goToBadge = () => navigate('/login-with-badge');
    const goToGuest = () => navigate('/login-as-guest');
    const goToRegister = () => navigate('/register');

    const handleBadgeScan = useCallback((scan: string) => { }, []);
    useBadgeScanner(handleBadgeScan);

    if (sessionStorage.getItem("authToken")) {
        sessionStorage.removeItem("authToken");
    }
    if (sessionStorage.getItem("username")) {
        sessionStorage.removeItem("username");
    }


    return (
        <div className="start-container">
            <div className="start-card">
                <div className="login-header">Anmeldevariante wählen...</div>
                <div className="login-divider"></div>
                <div className="login-buttons">
                    <button className="login-btn" onClick={goToEmailPwd}>
                        Anmeldung mit Username und Passwort
                    </button>
                    <button className="login-btn" onClick={goToBadge}>
                        Anmeldung mit Badge
                    </button>
                    <button className="login-btn" onClick={goToGuest}>
                        Anmeldung als Gast
                    </button>
                    <button className='login-btn' onClick={goToRegister}>
                        Noch kein Konto? - Registrieren!
                    </button>
                </div>
            </div>
        </div>
    );
}
