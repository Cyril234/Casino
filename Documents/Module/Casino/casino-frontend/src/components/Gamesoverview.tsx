import { useNavigate } from "react-router-dom";

export default function Gameoverview() {
        const navigate = useNavigate();
    return (
        <>
            <button className="start-btn" onClick={() => navigate('/gameoverview/blackjack')}>BlackJack</button>
        </>
    )
}