package com.example.casinobackend.Games.Poker;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Random;


import lombok.val;

public class PockerLogik {
    private static PockerLogik instance; // Die einzige Instanz

    private int buyIn;
    private int bb;
    private int sb;
    private ArrayList<Player> players = new ArrayList<Player>();
    private ArrayList<String> tableCards = new ArrayList<String>();
    
    ArrayList<String> playingcards = new ArrayList<>(Arrays.asList("As","Ah","Ad","Ac","Ks","Kh","Kd","Kc","Qs","Qh","Qd","Qc","Js","Jh","Jd","Jc","Ts","Th","Td","Tc","9s","9h","9d","9c","8s","8h","8d","8c","7s","7h","7d","7c","6s","6h","6d","6c","5s","5h","5d","5c","4s","4h","4d","4c","3s","3h","3d","3c","2s","2h","2d","2c"));
    ArrayList<String> pokerSpielerinnenNamen = new ArrayList<>(Arrays.asList("Alba","Alexa","Alice","Alma","Amira","Anja","Annika","Ava","Babette","Beate","Bella","Benita","Bente","Bianca","Bina","Britta","Caro","Cassie","Celina","Celine","Chiara","Christa","Clara","Coral","Dagmar","Daria","Delia","Denise","Diana","Dora","Doreen","Eliza","Ella","Emilia","Enid","Enya","Erika","Esra","Faye","Fee","Felicia","Fenja","Fiona","Franzi","Frida","Gesa","Gina","Giselle","Gitta","Gloria","Greta","Grete","Gudrun","Hannah","Hanni","Hedda","Hedwig","Helena","Hilda","Hilde","Ida","Ilka","Imke","Ines","Inga","Iris","Isabell","Isla","Jana","Janina","Janna","Jasmin","Jenny","Judith","Jule","Julika","Kaja","Kari","Karla","Katja","Kathi","Kerstin","Kim","Kira","Laila","Lara","Leni","Leonie","Lisbeth","Livia","Lotta","Luna","Maike","Margot","Mara","Maura","Melina","Meike","Mila","Minna","Nadja","Nala","Nelly","Nele","Nessa","Nika","Nike","Nora","Odile","Oktavia","Olivia","Oona","Ophelia","Orla","Otilie","Paula","Penelope","Petra","Philine","Pia","Pina","Prisca","Quinn","Rahel","Rena","Resi","Rieke","Romy","Ronja","Rosa","Roxy","Sabine","Saskia","Selma","Sienna","Sina","Solveig","Stella","Suse","Tabea","Tamara","Tara","Tessa","Thea","Tilda","Toni","Trixi","Uli","Ulla","Ulrike","Uma","Ursula","Ute","Valeria","Valeska","Vanya","Vera","Vicky","Viola","Vivi","Wanda","Wendy","Wenke","Wiebke","Wilma","Xandra","Xenia","Ximena","Yara","Yasmin","Ylva","Yve","Yvonne","Zelda","Zelia","Zilly","Zita","Zoe","Zoey","Zora"));

    public ArrayList<Player> gerWinner(){
        ArrayList<Player> winners = new ArrayList<>();

        PokerHandEvaluator handEvaluator = new PokerHandEvaluator();
        Map<Integer, List<String>> winningHands = handEvaluator.evaluateHend(
            List.of(
                List.of(players.get(0).getCards().get(0), players.get(0).getCards().get(1)),
                List.of(players.get(1).getCards().get(0), players.get(1).getCards().get(1)),
                List.of(players.get(2).getCards().get(0), players.get(2).getCards().get(1)),
                List.of(players.get(3).getCards().get(0), players.get(3).getCards().get(1))),
            List.of(tableCards.get(0),tableCards.get(1),tableCards.get(2),tableCards.get(3),tableCards.get(4))
        );

        for (Map.Entry<Integer, List<String>> entry : winningHands.entrySet()) {
            int spielerId = entry.getKey();
            winners.add(players.get(spielerId));
        }

        return winners;
    }

    public void dealCards(){
        ArrayList<String> tempCards = new ArrayList<>(playingcards); // kopieren
        Collections.shuffle(tempCards); // mischen
        tempCards = new ArrayList<>(tempCards.subList(0, 13));

        for(int i=0; i<4; i++){
            players.get(i).setCards(new ArrayList<>(Arrays.asList(tempCards.get(0+(2*i)), tempCards.get(1+(2*i)))));
        }

        tableCards.add(tempCards.get(8));
        tableCards.add(tempCards.get(9));
        tableCards.add(tempCards.get(10));
        tableCards.add(tempCards.get(11));
        tableCards.add(tempCards.get(12));
    }

    public void setUpPlayers() {
        Random rand = new Random();
        List<Integer> position = new ArrayList<>();
        position.add(0);
        position.add(1);
        position.add(2);
        position.add(3);

        for(int i=0; i<3; i++){
            String style = new String[] {"aggressive", "normal", "tight"}[rand.nextInt(3)];
            double tightness;
            double bluffFactor;

            if (style.equals("tight")){
                tightness = (Math.random() * (0.4 - 0.2) + 0.2);
                bluffFactor = Math.random() * (0.6 - 0.3) + 0.3;
            }else if(style.equals("normal")){
                tightness = Math.random() * (0.6 - 0.4) + 0.4;
                bluffFactor = Math.random() * (0.3 - 0.1) + 0.1;
            }else{
                tightness = Math.random() * (0.9 - 0.7) + 0.7;
                bluffFactor = Math.random() * (0.15 - 0.05) + 0.05;
            }

            NPC npc = new NPC(style, pokerSpielerinnenNamen.get(rand.nextInt(pokerSpielerinnenNamen.size())), tightness, bluffFactor, position.remove(rand.nextInt(position.size())), null, buyIn, i);
            players.add(npc);
        }
        players.add(new Player(position.get(0), null, buyIn, true, 3));
        players.sort(Comparator.comparing(Player::getPosition));
    }

    public static PockerLogik getInstance() {
        if (instance == null) {
            instance = new PockerLogik();
        }
        return instance;
    }

    public int getBuyIn() {
        return buyIn;
    }
    public void setBuyIn(int buyIn) {
        this.buyIn = buyIn;
    }
    public int getBb() {
        return bb;
    }
    public void setBb(int bb) {
        this.bb = bb;
    }
    public int getSb() {
        return sb;
    }
    public void setSb(int sb) {
        this.sb = sb;
    }
    public ArrayList<Player> getPlayers() {
        return players;
    }
    public void setPlayers(ArrayList<Player> players) {
        this.players = players;
    }
}
