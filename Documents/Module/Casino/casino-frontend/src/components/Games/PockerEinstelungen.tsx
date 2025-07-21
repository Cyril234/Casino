import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const PockerEinstelungen: React.FC = () => {
    const [smalBlind, setSmalBlind] = useState(0);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/gameoverview/poker', { state: { smalBlind } });
    };

    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="smalBlind">Small Blind:</label>
        <input
          id="smalBlind"
          type="number"
          value={smalBlind}
          min={0}
          onChange={e => setSmalBlind(Number(e.target.value))}
        />
        <button type="submit">Weiter zu Poker</button>
      </form>
    );
};

export default PockerEinstelungen;
