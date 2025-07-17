import { useNavigate } from 'react-router';
import '../../styles/LoginWithBadge.css';
export default function LoginWithBadge() {
    const navigate = useNavigate();

    if (sessionStorage.getItem("authToken")) {
        sessionStorage.removeItem("authToken");
    }
    if (sessionStorage.getItem("username")) {
        sessionStorage.removeItem("username");
    }

    return (
        <>
            <div className="start-container">
                <div className="start-card">
                    <div className="start-title">Badge-Login</div>
                    <div className="start-desc">Halte deinen Badge an den Leser am Automaten, um dich anzumelden!</div>
                    <button className="start-btn" onClick={() => navigate('/login-overview')}>Zurück</button>
                </div>
            </div>
        </>
    )
}