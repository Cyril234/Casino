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


    // Badge-Scan Callback
    const handleBadgeScan = useCallback((scan: string) => { }, []);
    useBadgeScanner(handleBadgeScan);
return (
  <>
    <div className="unique-register-container">
      <div className="unique-register-card full-width">
        <h1 className="unique-register-title">Badge-Login</h1>
        <p className="unique-register-desc">
          Halte deinen Badge an den Leser am Automaten, um dich anzumelden!
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