import { useNavigate } from 'react-router';
import '../../styles/LoginWithBadge.css';
import sounds from '../litleThings/Sounds';
import { useCallback, useEffect } from 'react';
import { useBadgeScanner } from './LoginBage';

export default function LoginWithBadge() {
  const navigate = useNavigate();

  if (sessionStorage.getItem("authToken")) {
    sessionStorage.removeItem("authToken");
  }
  if (sessionStorage.getItem("username")) {
    sessionStorage.removeItem("username");
  }

  const handleBadgeScan = useCallback((scan: string) => { }, []);
  useBadgeScanner(handleBadgeScan);

  useEffect(() => {
    sounds.stop("casinomusic.mp3");
    sounds.stop("blackjackmusic.wav");
    sounds.stop("horseracemusic.wav");
    sounds.stop("minesmusic.wav");
    sounds.stop("roulettemusic.wav");
    sounds.stop("slotmusic.wav");
  });

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
