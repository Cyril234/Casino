import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import "../../styles/BlackjackInfo.css";

export default function MinesInfo() {
  const navigate = useNavigate();

  return (
    <div className="info-page">
      <button className="back-button" onClick={() => navigate("/gameoverview/minenfeld")}>
        <MdArrowBack /> Zurück zum Spiel
      </button>

      <h1>Mines Regeln</h1>

      <div className="info-section">
        <h2>Ziel des Spiels</h2>
        <p>
          Decke Felder auf, ohne eine Bombe zu treffen. Jeder erfolgreiche Zug erhöht deinen Gewinn. Du kannst jederzeit aussteigen
          („Cashout“) und den aktuellen Gewinn sichern.
        </p>
      </div>

      <div className="info-section">
        <h2>Spielverlauf</h2>
        <ul>
          <li>Wähle vor Spielbeginn deinen Einsatz und die Anzahl der versteckten Bomben</li>
          <li>Decke nacheinander Felder auf</li>
          <li>Jedes sichere Feld erhöht deinen Gewinn</li>
          <li>Triffst du eine Bombe, verlierst du deinen Einsatz</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Cashout</h2>
        <p>
          Du kannst jederzeit den „Cashout“-Button drücken, um deinen aktuellen Gewinn zu sichern. Danach ist die Runde beendet.
        </p>
      </div>

      <div className="info-section">
        <h2>Strategie-Tipp</h2>
        <p>
          Je mehr Felder du erfolgreich aufdeckst, desto höher ist dein Gewinn – aber auch das Risiko steigt. Finde dein
          Gleichgewicht zwischen Risiko und Belohnung!
        </p>
      </div>
    </div>
  );
}
