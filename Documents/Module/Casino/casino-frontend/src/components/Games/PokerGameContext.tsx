import { createContext, useContext, useState } from "react";

export enum Style {
  Aggressive = 'aggressive',
  Normal     = 'normal',
  Tight      = 'tight'
}

export interface Enemy {
  cards: [string | null, string | null];
  name: string;
  style: Style;
  stack: number;
  position: number;
  tightness: number;
  bluffFactor: number;
}

export interface Player {
  cards: [string | null, string | null];
  stack: number;
  position: number;
}

interface PokerGameContextType {
  players: Player[];
  enemys: Enemy[];
  tableCards: string[];
  round: number;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setEnemys: React.Dispatch<React.SetStateAction<Enemy[]>>;
  setTableCards: React.Dispatch<React.SetStateAction<string[]>>;
  setRound: React.Dispatch<React.SetStateAction<number>>;
  setupGame: (smallBlind: number) => void;
  dealCards: () => void;
}

const PokerGameContext = createContext<PokerGameContextType | undefined>(undefined);

export const usePokerGame = () => {
  const ctx = useContext(PokerGameContext);
  if (!ctx) throw new Error("usePokerGame must be used within PokerGameProvider");
  return ctx;
};

const playingcards: string[] = [
  'As','Ah','Ad','Ac','Ks','Kh','Kd','Kc','Qs','Qh','Qd','Qc','Js','Jh','Jd','Jc',
  'Ts','Th','Td','Tc','9s','9h','9d','9c','8s','8h','8d','8c','7s','7h','7d','7c',
  '6s','6h','6d','6c','5s','5h','5d','5c','4s','4h','4d','4c','3s','3h','3d','3c',
  '2s','2h','2d','2c'
];

const pokerSpielerinnenNamen: string[] = [
  "Alexa", "Bella", "Caro", "Diana", "Eliza", "Fiona", "Gina", "Hannah", "Isla", "Jasmin",
  "Kira", "Lara", "Mila", "Nora", "Olivia", "Pia", "Quinn", "Rosa", "Sienna", "Tara",
  "Uma", "Vicky", "Wanda", "Yara", "Zoe", "Amira", "Bianca", "Clara", "Denise", "Emilia",
  "Frida", "Greta", "Helena", "Inga", "Jule", "Karla", "Leonie", "Mara", "Nadja", "Ophelia",
  "Paula", "Rieke", "Stella", "Tessa", "Ulla", "Vera", "Wilma", "Xenia", "Yasmin", "Zita",
  "Anja", "Beate", "Celina", "Daria", "Ella", "Faye", "Gloria", "Hedda", "Iris", "Janna",
  "Kathi", "Livia", "Meike", "Nika", "Orla", "Petra", "Rahel", "Sabine", "Thea", "Ute",
  "Valeria", "Wiebke", "Xandra", "Yvonne", "Zora", "Ava", "Bente", "Chiara", "Doreen", "Enya",
  "Felicia", "Gesa", "Helena", "Ilka", "Judith", "Kim", "Luna", "Melina", "Nele", "Oona",
  "Penelope", "Ronja", "Saskia", "Tamara", "Ulrike", "Valeska", "Wendy", "Xenia", "Yara", "Zoey",
  "Alma", "Britta", "Celine", "Delia", "Esra", "Fee", "Giselle", "Hedwig", "Ida", "Julika",
  "Katja", "Leni", "Minna", "Nelly", "Otilie", "Prisca", "Romy", "Selma", "Tilda", "Uli",
  "Viola", "Wenke", "Ximena", "Ylva", "Zelia", "Annika", "Benita", "Christa", "Dora", "Erika",
  "Fenja", "Gudrun", "Hilde", "Isabell", "Jana", "Kerstin", "Lisbeth", "Margot", "Nike", "Oktavia",
  "Philine", "Resi", "Solveig", "Tabea", "Ursula", "Vicky", "Wanda", "Xenia", "Yvonne", "Zita",
  "Alba", "Babette", "Coral", "Dora", "Enid", "Fenja", "Grete", "Hilda", "Imke", "Janina",
  "Kaja", "Lotta", "Maike", "Nala", "Odile", "Pia", "Rena", "Sina", "Trixi", "Ute",
  "Vanya", "Wilma", "Xandra", "Yara", "Zelda", "Alice", "Bina", "Cassie", "Dagmar", "Ella",
  "Franzi", "Gitta", "Hanni", "Ines", "Jenny", "Kari", "Laila", "Maura", "Nessa", "Orla",
  "Pina", "Roxy", "Suse", "Toni", "Ulla", "Vivi", "Wanda", "Xenia", "Yve", "Zilly"
];

function getRandomCards<T>(arr: T[], count: number): T[] {
  const arrayCopy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < count && arrayCopy.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * arrayCopy.length);
    result.push(arrayCopy[randomIndex]);
    arrayCopy.splice(randomIndex, 1);
  }
  return result;
}

export const PokerGameProvider: React.FC<{children: any}> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [enemys, setEnemys] = useState<Enemy[]>([]);
  const [tableCards, setTableCards] = useState<string[]>([]);
  const [round, setRound] = useState<number>(0);

  const setupGame = (smallBlind: number) => {
    let position = [0,1,2,3];
    let enemysTemp: Enemy[] = [];
    for (let i = 0; i < 3; i++) {
      const styleTemp = [Style.Aggressive, Style.Normal, Style.Tight][Math.floor(Math.random() * 3)];
      let tightness: number;
      let bluffFactor: number;
      const index = Math.floor(Math.random() * position.length);
      let positionTemp = position[index];
      position.splice(index, 1);
      if (styleTemp === Style.Aggressive){
        tightness = Math.random() * (0.4 - 0.2) + 0.2;
        bluffFactor = Math.random() * (0.6 - 0.3) + 0.3;
      }else if(styleTemp === Style.Normal){
        tightness = Math.random() * (0.6 - 0.4) + 0.4;
        bluffFactor = Math.random() * (0.3 - 0.1) + 0.1;
      }else{
        tightness = Math.random() * (0.9 - 0.7) + 0.7;
        bluffFactor = Math.random() * (0.15 - 0.05) + 0.05;
      }
      enemysTemp.push({
        cards: [null, null],
        name: pokerSpielerinnenNamen[Math.floor(Math.random() * pokerSpielerinnenNamen.length)],
        style: styleTemp,
        stack: 1000,
        position: positionTemp,
        tightness,
        bluffFactor
      });
    }
    // Spieler selbst
    const player: Player = {
      cards: [null, null],
      stack: 1000,
      position: position[0]
    };
    setPlayers([player]);
    setEnemys(enemysTemp);
    setTableCards([]);
    setRound(0);
  };

  const dealCards = () => {
    const cards = getRandomCards(playingcards, 13);
    setPlayers(prev => prev.length > 0 ? [{...prev[0], cards: [cards[0], cards[1]]}] : prev);
    setEnemys(prev => prev.map((e, i) => ({...e, cards: [cards[2+i*2], cards[3+i*2]]})));
    setTableCards([cards[8], cards[9], cards[10], cards[11], cards[12]]);
    setRound(1);
  };

  return (
    <PokerGameContext.Provider value={{
      players, enemys, tableCards, round,
      setPlayers, setEnemys, setTableCards, setRound,
      setupGame, dealCards
    }}>
      {children}
    </PokerGameContext.Provider>
  );
}; 