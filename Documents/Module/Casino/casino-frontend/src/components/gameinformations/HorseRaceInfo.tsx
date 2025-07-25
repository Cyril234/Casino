import { useNavigate } from "react-router";
import "../../styles/HorseRaceBetInfo.css"

export default function HorseRaceInfo() {
    const navigate = useNavigate();
    const handleBack = () => navigate("/gameoverview/horserace");

    return (
        <div className="info-page">
            <button className="back-button" onClick={handleBack}>
                Zurück
            </button>

            <h1>Pferderennen – Spielinfo</h1>

            <div className="info-section">
                <h2>Spielidee</h2>
                <p>
                    Wähle ein Pferd, setze eine beliebige Anzahl Coins, und verfolge, ob dein Pferd gewinnt.
                    Jedes Pferd hat eine eigene Gewinnwahrscheinlichkeit und einen entsprechenden Multiplikator.
                    Wenn dein Pferd gewinnt, bekommst du das Vielfache deines Einsatzes zurück.
                </p>
            </div>

            <div className="info-section">
                <h2>So funktioniert's</h2>
                <ul>
                    <li>Wähle deinen Einsatz.</li>
                    <li>Wähle ein Pferd – die Gewinnwahrscheinlichkeit und der Multiplikator werden angezeigt.</li>
                    <li>Starte das Spiel durch Klicken auf „Wette auf …“.</li>
                    <li>Das Siegerpferd wird zufällig bestimmt – je seltener, desto höher der Gewinn.</li>
                    <li>Wenn du das richtige Pferd gewählt hast, bekommst du den Gewinn automatisch gutgeschrieben.</li>
                </ul>
            </div>

            <div className="info-section">
                <h2>Multiplikatoren</h2>
                <p>
                    Je unwahrscheinlicher ein Pferd gewinnt, desto höher ist der Multiplikator. Beispiel:
                </p>
                <ul>
                    <li><strong>Blitz</strong>: 25% Gewinnchance → 1.2x Auszahlung</li>
                    <li><strong>Pfeil</strong>: 3% Gewinnchance → 12x Auszahlung</li>
                </ul>
            </div>
            <div className="info-section">
                <h2>Hinweise</h2>
                <ul>
                    <li>Du kannst nur wetten, wenn du genug Coins hast.</li>
                    <li>Das Guthaben wird nach jedem Spiel automatisch aktualisiert.</li>
                    <li>Die Wahrscheinlichkeit basiert auf Zufallsberechnung – es gibt keinen garantierten Gewinn.</li>
                </ul>
            </div>
        </div>
    );
}
