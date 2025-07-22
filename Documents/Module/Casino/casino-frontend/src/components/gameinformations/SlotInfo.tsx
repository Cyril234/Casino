import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import "../../styles/SlotInfo.css";

export default function SlotInfo() {
  const navigate = useNavigate();

  return (
    <div className="slotinfo-page">
      <button
        className="back-button"
        onClick={() => navigate("/gameoverview/slot")}
      >
        <MdArrowBack /> Zurück zum Slot-Spiel
      </button>

      <h1>Slot-Spiel Regeln</h1>

      <div className="info-section">
        <h2>Ziel des Spiels</h2>
        <p>
          Drehe die Walzen und versuche, Gewinnkombinationen zu erzielen. Je
          höher dein Einsatz und je besser die Kombination, desto mehr
          Münzen kannst du gewinnen.
        </p>
      </div>

      <div className="info-section">
        <h2>Einsatz</h2>
        <p>
          Wähle vor jedem Spin deinen Einsatz (Münzen). Dein Guthaben wird um
          diesen Wert reduziert, bis die Walzen stoppen.
        </p>
      </div>

      <div className="info-section">
        <h2>Symbole</h2>
        <ul>
          <li>Kirsche</li>
          <li>Zitrone</li>
          <li>Glocke</li>
          <li>Stern</li>
          <li>Sieben</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Gewinnkombinationen</h2>
        <ul>
          <li>Drei gleiche Symbole = hoher Gewinn</li>
          <li>Zwei gleiche Symbole + Wild = mittlerer Gewinn</li>
          <li>Beliebiges Symbol = geringer Gewinn</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Aktionen</h2>
        <ul>
          <li>
            <strong>Spin:</strong> Starte die Walzen und warte 2 Sekunden auf das
            Ergebnis.
          </li>
          <li>
            <strong>Zurück:</strong> Verlasse das Slot-Spiel und kehre zur
            Spielübersicht zurück.
          </li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Auszahlung</h2>
        <p>
          Gewonnene Münzen werden deinem Guthaben sofort gutgeschrieben. Deine
          Einsätze werden bei Verlust abgezogen.
        </p>
      </div>
    </div>
  );
}
 