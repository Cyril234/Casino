import { useState } from "react";

type Player = {
  position: number;
  cards: string[];
  chips: number;
  player: boolean;
  amount: number;
  aktion: string;
};


type NPC = Player & {
  style: string;
  name: string;
  tightness: number;
  bluffFactor: number;
};

export default function Pocker() {
    const [players, setPlayers] = useState<Player | NPC[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState(0);

    const [callAmount, setCallAmount] = useState(0);
    const [potSize, setPotSize] = useState(0);

    const token = sessionStorage.getItem("authToken");

    return(
        <div>
        </div>
    );
}