import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import "../../styles/BlackjackInfo.css"
export default function BlackjackInfo() {
  const navigate = useNavigate();

  return (
    <div className="info-page">
      <button className="back-button" onClick={() => navigate("/gameoverview/blackjack")}>
        <MdArrowBack /> Zurück zum Spiel
      </button>

      <h1>Blackjack Regeln</h1>

      <div className="info-section">
        <h2>Ziel des Spiels</h2>
        <p>Erreiche mit deinen Karten möglichst nah an 21 Punkte, ohne sie zu überschreiten. Der Dealer spielt gegen dich.</p>
      </div>

      <div className="info-section">
        <h2>Kartenwerte</h2>
        <ul>
          <li>Zahlenkarten zählen ihren aufgedruckten Wert</li>
          <li>Bildkarten (J, Q, K) zählen 10 Punkte</li>
          <li>Ass zählt 1 oder 11 – je nachdem, was besser ist</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Aktionen</h2>
        <ul>
          <li><strong>Hit:</strong> Eine weitere Karte nehmen</li>
          <li><strong>Stand:</strong> Keine Karte mehr nehmen, Runde beenden</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Gewinn</h2>
        <p>Du gewinnst, wenn dein Handwert höher ist als der des Dealers – ohne über 21 zu gehen.</p>
      </div>
    </div>
  );
}
