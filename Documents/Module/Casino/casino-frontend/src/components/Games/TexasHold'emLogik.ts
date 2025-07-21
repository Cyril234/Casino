import { calculateEquity } from 'poker-odds';

const playingcards: string[] = [
  'As','Ah','Ad','Ac','Ks','Kh','Kd','Kc','Qs','Qh','Qd','Qc','Js','Jh','Jd','Jc',
  'Ts','Th','Td','Tc','9s','9h','9d','9c','8s','8h','8d','8c','7s','7h','7d','7c',
  '6s','6h','6d','6c','5s','5h','5d','5c','4s','4h','4d','4c','3s','3h','3d','3c',
  '2s','2h','2d','2c'
];

let cardsPlayer: [string, string];
let cardsTable: string[];
let enemys: enemy[] = [];
let round = 0;
let positionPlayer;

enum Style {
    Aggressive = 'aggressive',
    Normal     = 'normal',
    Tight      = 'tight'
}


interface enemy {
    cards: [string, string] | [null, null];
    name: string;
    style: Style;
    stack: number;           // current stack in chips
    position: number;
    tightness: number;       // [0..1], lower = looser
    bluffFactor: number;     // [0..1], chance to bluff
}

interface player {
    cards: [string, string] | [null, null];
    stack: number;           // current stack in chips
    position: number;
}

function TexasHoldemChachen(playerHand: [string, string]): number {
  const cardsNotInUse = playingcards.filter(card => !playerHand.includes(card));
  let sum = 0;

  for (let i = 0; i < 500; i++) {
    const enemyHands = getRandomCards(cardsNotInUse, 6);
    const hands = [
      [playerHand[0], playerHand[1]],
      [enemyHands[0], enemyHands[1]],
      [enemyHands[2], enemyHands[3]],
      [enemyHands[4], enemyHands[5]],
    ];
    const result = calculateEquity(hands, undefined, 100, false);
    sum += (result[0].wins / result[0].count) * 100; 
  }

  return sum / 500;
}

function TexasHoldemChachenAfterFlush(playerHand: [string, string], board: string[]): number {
  const cardsNotInUse = playingcards.filter(card => !(playerHand.includes(card) && playerHand.includes(board)));
  let sum = 0;

  for (let i = 0; i < 500; i++) {
    const enemyHands = getRandomCards(cardsNotInUse, 6);
    const hands = [
      [playerHand[0], playerHand[1]],
      [enemyHands[0], enemyHands[1]],
      [enemyHands[2], enemyHands[3]],
      [enemyHands[4], enemyHands[5]],
    ];
    const result = calculateEquity(hands, board, 100, false);
    sum += (result[0].wins / result[0].count) * 100; 
  }

  return sum / 500;
}

export function EnemyDesision() {
    enemys.map((person)=>{
        let random = Math.random() * (1.2 - 0.8) + 0.8;
        let winchance;
        let rais
        if(round === 1){
            winchance = TexasHoldemChachen([person.cards[0], person.cards[1]]);
        }else if(round === 2){
            winchance = TexasHoldemChachenAfterFlush([person.cards[0], person.cards[1]], [cardsTable[0], cardsTable[1], cardsTable[2]]);
        }else if(round === 2){
            winchance = TexasHoldemChachenAfterFlush([person.cards[0], person.cards[1]], [cardsTable[0], cardsTable[1], cardsTable[2], cardsTable[3]]);
        }else{
            winchance = TexasHoldemChachenAfterFlush([person.cards[0], person.cards[1]], cardsTable);
            round = 0;
        }

        if(person.playstile = "agressif"){
            if(45*random >= winchance){

            }else if(35*random >= winchance){
                rais=0;
            }else{
                rais=-1;
            }
        }


    }) 
    round++;
}

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

export function dealCards() {
  const cards = getRandomCards(playingcards, 13);
  cardsPlayer = [cards[0], cards[1]];
    if (enemys && enemys.length === 4) {
    enemys[0].cards = [cards[2], cards[3]];
    enemys[1].cards = [cards[4], cards[5]];
    enemys[2].cards = [cards[6], cards[7]];
  }
  cardsTable = [cards[8], cards[9], cards[10], cards[11], cards[12]];
  round = 1;
}

export function setupGame(SMALL_BLIND: number): T[] {
    let position= [0,1,2,3];
    let teilnemerListe = [];

    for (let i: number = 0; i < 4; i++) {
        let styleTemp:Style = [Style.Aggressive, Style.Normal, Style.Tight][Math.floor(Math.random() * 3)];
        let tightness:number;
        let bluffFactor:number;

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
        enemys = [    {
            cards: [null, null],
            name: pokerSpielerinnenNamen[Math.floor(Math.random() * pokerSpielerinnenNamen.length)],
            style: styleTemp,
            stack: 1000,           // current stack in chips
            position: positionTemp,
            tightness: tightness,      // [0..1], lower = looser
            bluffFactor: bluffFactor    // [0..1], chance to bluff
        }, ...enemys]
    }

    positionPlayer = position[0];

    teilnemerListe = [{
        cards: [null, null],
        stack: 1000,
        position: position[0]
    },... enemys];

    teilnemerListe.sort((a, b) => a.position - b.position);

    return teilnemerListe;
}

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



