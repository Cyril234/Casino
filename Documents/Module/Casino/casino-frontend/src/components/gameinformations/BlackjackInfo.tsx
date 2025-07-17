import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function BlackJackInfo() {

    const currentToken = sessionStorage.getItem("authToken");

    const navigate = useNavigate();
    
    useEffect(() => {
        if (!currentToken) {
            navigate("/");
        }
    })

    return (
        <>
            <h1>Blackjack Spielanleitung</h1>
            <div>
                <p>
                    Beim Blackjack versuchst du, mit deinen Karten möglichst nahe an 21 Punkte zu kommen – aber nicht mehr. Du spielst gegen den Dealer. Wer näher an 21 ist, gewinnt.
                </p>
                <p>
                    Karten von 2 bis 10 zählen ihren Zahlenwert. Bube (J), Dame (Q) und König (K) zählen 10 Punkte. Ein Ass zählt entweder 1 oder 11 Punkte – je nachdem, was für dich besser ist.
                </p>
                <p>
                    Am Anfang gibst du deinen Einsatz in Coins ein und klickst auf <strong>„Spiel starten“</strong>. Du bekommst zwei Karten, der Dealer auch. Danach kannst du mit <strong>„Hit“</strong> eine weitere Karte ziehen oder mit <strong>„Stand“</strong> sagen, dass du keine Karte mehr willst.
                </p>
                <p>
                    Wenn du über 21 Punkte kommst, hast du sofort verloren. Wenn du „Stand“ wählst, ist der Dealer dran. Er zieht Karten, bis er mindestens 17 Punkte hat oder über 21 geht.
                </p>
                <p>
                    Du gewinnst, wenn du näher an 21 bist als der Dealer. Bei einem Unentschieden bekommst du deinen Einsatz zurück. Wenn der Dealer gewinnt, verlierst du deinen Einsatz.
                </p>
                <p>
                    <strong>Gewinne:</strong> Wenn du gewinnst, bekommst du deinen Einsatz doppelt zurück – also dein Einsatz plus den gleichen Betrag als Gewinn. Bei einem Unentschieden bekommst du deinen Einsatz zurück. Wenn du verlierst, ist dein Einsatz weg.
                </p>
                <p>
                    Dein aktuelles Guthaben siehst du jederzeit oben links. Viel Glück!
                </p>
            </div>
            <button onClick={() => navigate("/gameoverview/blackjack")}>Zurück</button>
        </>
    );
}
