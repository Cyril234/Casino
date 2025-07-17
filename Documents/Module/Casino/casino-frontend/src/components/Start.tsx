import { useNavigate } from "react-router";
import "../styles/Start.css";

import chipImg from "../assets/Blackjack/3♠.png";
import cardImg from "../assets/Blackjack/4♠.png";
import cardImg2 from "../assets/Blackjack/5♠.png";
import { useEffect } from "react";
import { useCallback } from "react";
import { useBadgeScanner } from "./login/LoginBage";

export default function Start() {
    const navigate = useNavigate();

    // Badge-Scan Callback
    const handleBadgeScan = useCallback((scan: string) => {}, []);
    useBadgeScanner(handleBadgeScan);

    
    useEffect(() => {
        if (sessionStorage.getItem("authToken")) {
            sessionStorage.removeItem("authToken")
        }
        if (sessionStorage.getItem("username")) {
            sessionStorage.removeItem("username")
        }
    })
    
    function handleLogin() {
        navigate("/login-overview");
    }
    return (
        <div className="start-container">
            <div className="start-overlay" />
            <div className="start-card modern">
                <h1 className="start-title">Willkommen im Casino!</h1>
                <p className="start-desc">Erlebe echtes Casino-Feeling mit modernen Spielen und exklusivem Ambiente.</p>
                <p className="start-desc">Registriere dich oder melde dich an und starte direkt durch!</p>
                <button className="start-btn" onClick={handleLogin}>Loslegen!</button>
                <div className="start-deco">
                    <img src={chipImg} alt="Chip" className="chip" />
                    <img src={cardImg} alt="Karte" className="chip" />
                    <img src={cardImg2} alt="Karte 2" className="chip" />
                </div>
            </div>
        </div>
    );
}
