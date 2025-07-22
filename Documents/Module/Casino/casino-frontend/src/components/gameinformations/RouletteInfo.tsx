import { useNavigate } from 'react-router-dom';
import '../../styles/RouletteInfo.css';
import { MdArrowBack } from 'react-icons/md';

export default function RouletteInfo() {
  const navigate = useNavigate();

  return (
    <div className="rouletteinfo-page">
      <button
        className="back-button"
        onClick={() => navigate('/gameoverview/roulette')}
      >
        <MdArrowBack /> Zurück zum Roulette
      </button>

      <h1>Roulette Regeln</h1>

      <div className="info-section">
        <h2>Ziel des Spiels</h2>
        <p>
          Setze auf die Zahl oder Farbkategorie, auf die die Kugel fallen soll.
        </p>
      </div>

      <div className="info-section">
        <h2>Roulette-Rad & Zahlen</h2>
        <ul>
          <li>Europäisches Rad: 37 Felder (0–36)</li>
          <li>Amerikanisches Rad: 38 Felder (0, 00 und 1–36)</li>
          <li>Zahlen 1–36 sind rot oder schwarz, 0 bzw. 00 ist grün</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Wettarten</h2>
        <ul>
          <li><strong>Einzelne Zahl (Straight):</strong> Auszahlung 35 : 1</li>
          <li><strong>Rot/Schwarz:</strong> Auszahlung 1 : 1</li>
          <li><strong>Gerade/Ungerade:</strong> Auszahlung 1 : 1</li>
          <li><strong>Niedrig/Hoch (1–18/19–36):</strong> Auszahlung 1 : 1</li>
          <li><strong>Dutzend:</strong> Auszahlung 2 : 1</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Spielablauf</h2>
        <p>
          Wähle deinen Einsatz, klicke auf „Spin“. Die Kugel rollt und bleibt lange genug liegen, um das Gewinnergebnis anzuzeigen.
        </p>
      </div>

      <div className="info-section">
        <h2>Auszahlung</h2>
        <p>
          Gewinne werden sofort basierend auf deiner Wettart ausgezahlt: z. B. 35× Einsatz für Einzelzahl, 1× Einsatz für Farben.
        </p>
      </div>
    </div>
  );
}
 