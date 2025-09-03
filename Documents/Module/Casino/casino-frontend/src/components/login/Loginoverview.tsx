import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import '../../styles/Loginoverview.css';
import { useBadgeScanner } from './LoginBage';
import sounds from '../litleThings/Sounds';

export default function Loginoverview() {
  // Musik nur einmal stoppen
  useEffect(() => {
    ["casinomusic.mp3","blackjackmusic.wav","horseracemusic.wav","minesmusic.wav","roulettemusic.wav","slotmusic.wav"]
      .forEach(s => sounds.stop(s));
  }, []);

  const navigate = useNavigate();

  const goToEmailPwd = () => navigate('/login-with-email-and-password');
  const goToBadge    = () => navigate('/login-with-badge');
  const goToGuest    = () => navigate('/login-as-guest');
  const goToRegister = () => navigate('/register');

  // React-Refs statt querySelectorAll
  const btnRefs = useRef<HTMLButtonElement[]>([]);
  const setBtnRef = (index: number) => (el: HTMLButtonElement | null) => {
    if (el) btnRefs.current[index] = el;
  };

  const [idx, setIdx] = useState(0);

  const handleBadgeScan = useCallback((scan: string) => { /* ... */ }, []);
  useBadgeScanner(handleBadgeScan);

  // Session nur einmal aufräumen
  useEffect(() => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("username");
  }, []);

  // Pfeilnavigation (am Container verwenden)
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const total = btnRefs.current.length;
    if (!total) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx(prev => {
        const next = (prev + 1) % total;
        btnRefs.current[next]?.focus();
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx(prev => {
        const next = (prev - 1 + total) % total;
        btnRefs.current[next]?.focus();
        return next;
      });
    } else if (e.key === "Home") {
      e.preventDefault();
      btnRefs.current[0]?.focus();
      setIdx(0);
    } else if (e.key === "End") {
      e.preventDefault();
      const last = total - 1;
      btnRefs.current[last]?.focus();
      setIdx(last);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // Space nicht scrollen lassen
      btnRefs.current[idx]?.click();
    }
  };

  // Ersten Button nach Mount fokussieren
  useEffect(() => {
    btnRefs.current[0]?.focus();
  }, []);

  return (
    <div className="start-container">
      <div className="start-card">
        <div className="login-header">Anmeldevariante wählen...</div>
        <div className="login-divider"></div>

        {/* Hier Keydown anbinden + (optional) ARIA-Rollen */}
        <div
          className="login-buttons"
          role="menu"
          aria-label="Anmeldevariante wählen"
          onKeyDown={onKeyDown}
        >
          <button
            ref={setBtnRef(0)}
            className="login-btn"
            role="menuitem"
            onClick={goToEmailPwd}
          >
            Anmeldung mit Username und Passwort
          </button>

          <button
            ref={setBtnRef(1)}
            className="login-btn"
            role="menuitem"
            onClick={goToBadge}
          >
            Anmeldung mit Badge
          </button>

          <button
            ref={setBtnRef(2)}
            className="login-btn"
            role="menuitem"
            onClick={goToGuest}
          >
            Anmeldung als Gast
          </button>

          <button
            ref={setBtnRef(3)}
            className="login-btn"
            role="menuitem"
            onClick={goToRegister}
          >
            Noch kein Konto? - Registrieren!
          </button>
        </div>
      </div>
    </div>
  );
}