package com.example.casinobackend.Games.Poker;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import com.example.casinobackend.Games.Poker.NPCLogic.NPCEntscheidung;

public class PockerLogik {
    ArrayList<String> playingcards = new ArrayList<>(Arrays.asList("As","Ah","Ad","Ac","Ks","Kh","Kd","Kc","Qs","Qh","Qd","Qc","Js","Jh","Jd","Jc","Ts","Th","Td","Tc","9s","9h","9d","9c","8s","8h","8d","8c","7s","7h","7d","7c","6s","6h","6d","6c","5s","5h","5d","5c","4s","4h","4d","4c","3s","3h","3d","3c","2s","2h","2d","2c"));
    ArrayList<String> pokerSpielerinnenNamen = new ArrayList<>(Arrays.asList("Alba","Alexa","Alice","Alma","Amira","Anja","Annika","Ava","Babette","Beate","Bella","Benita","Bente","Bianca","Bina","Britta","Caro","Cassie","Celina","Celine","Chiara","Christa","Clara","Coral","Dagmar","Daria","Delia","Denise","Diana","Dora","Doreen","Eliza","Ella","Emilia","Enid","Enya","Erika","Esra","Faye","Fee","Felicia","Fenja","Fiona","Franzi","Frida","Gesa","Gina","Giselle","Gitta","Gloria","Greta","Grete","Gudrun","Hannah","Hanni","Hedda","Hedwig","Helena","Hilda","Hilde","Ida","Ilka","Imke","Ines","Inga","Iris","Isabell","Isla","Jana","Janina","Janna","Jasmin","Jenny","Judith","Jule","Julika","Kaja","Kari","Karla","Katja","Kathi","Kerstin","Kim","Kira","Laila","Lara","Leni","Leonie","Lisbeth","Livia","Lotta","Luna","Maike","Margot","Mara","Maura","Melina","Meike","Mila","Minna","Nadja","Nala","Nelly","Nele","Nessa","Nika","Nike","Nora","Odile","Oktavia","Olivia","Oona","Ophelia","Orla","Otilie","Paula","Penelope","Petra","Philine","Pia","Pina","Prisca","Quinn","Rahel","Rena","Resi","Rieke","Romy","Ronja","Rosa","Roxy","Sabine","Saskia","Selma","Sienna","Sina","Solveig","Stella","Suse","Tabea","Tamara","Tara","Tessa","Thea","Tilda","Toni","Trixi","Uli","Ulla","Ulrike","Uma","Ursula","Ute","Valeria","Valeska","Vanya","Vera","Vicky","Viola","Vivi","Wanda","Wendy","Wenke","Wiebke","Wilma","Xandra","Xenia","Ximena","Yara","Yasmin","Ylva","Yve","Yvonne","Zelda","Zelia","Zilly","Zita","Zoe","Zoey","Zora"));

    public double winnChanche(List<String> handAbgleich, List<String> tableAbgleich, int round){
        int winns = 0;
        PokerHandEvaluator handEvaluator = new PokerHandEvaluator();
        ArrayList<String> tempCards = new ArrayList<>(playingcards); // kopieren
        tempCards.remove(handAbgleich.get(0));
        tempCards.remove(handAbgleich.get(1));
        if(round == 0){
            Collections.shuffle(tempCards); // mischen

            for(int i=0; i<500; i++){
                Collections.shuffle(tempCards); // mischen
                Map<Integer, List<String>> winningHands = handEvaluator.evaluateHend(
                    List.of(
                        List.of(handAbgleich.get(0), handAbgleich.get(1)),
                        List.of(tempCards.get(2), tempCards.get(3)),
                        List.of(tempCards.get(4), tempCards.get(5)),
                        List.of(tempCards.get(6), tempCards.get(7))),
                    List.of(tempCards.get(8),tempCards.get(9),tempCards.get(10),tempCards.get(11),tempCards.get(12))
                );
                if (winningHands.containsKey(0)) {
                    winns++;
                }
            }
        }else if(round == 1){
            tempCards.remove(tableAbgleich.get(0));
            tempCards.remove(tableAbgleich.get(1));
            tempCards.remove(tableAbgleich.get(2));
            Collections.shuffle(tempCards); // mischen

            for(int i=0; i<500; i++){
                Collections.shuffle(tempCards); // mischen
                Map<Integer, List<String>> winningHands = handEvaluator.evaluateHend(
                    List.of(
                        List.of(handAbgleich.get(0), handAbgleich.get(1)),
                        List.of(tempCards.get(2), tempCards.get(3)),
                        List.of(tempCards.get(4), tempCards.get(5)),
                        List.of(tempCards.get(6), tempCards.get(7))),
                    List.of(tableAbgleich.get(0),tableAbgleich.get(1),tableAbgleich.get(2),tempCards.get(8),tempCards.get(9))
                );
                if (winningHands.containsKey(0)) {
                    winns++;
                }
            }
        }else if(round == 2){
            tempCards.remove(tableAbgleich.get(0));
            tempCards.remove(tableAbgleich.get(1));
            tempCards.remove(tableAbgleich.get(2));
            tempCards.remove(tableAbgleich.get(3));
            Collections.shuffle(tempCards); // mischen

            for(int i=0; i<500; i++){
                Collections.shuffle(tempCards); // mischen
                Map<Integer, List<String>> winningHands = handEvaluator.evaluateHend(
                    List.of(
                        List.of(handAbgleich.get(0), handAbgleich.get(1)),
                        List.of(tempCards.get(2), tempCards.get(3)),
                        List.of(tempCards.get(4), tempCards.get(5)),
                        List.of(tempCards.get(6), tempCards.get(7))),
                    List.of(tableAbgleich.get(0),tableAbgleich.get(1),tableAbgleich.get(2),tableAbgleich.get(3),tempCards.get(8))
                );
                if (winningHands.containsKey(0)) {
                    winns++;
                }
            }
        }else{
            tempCards.remove(tableAbgleich.get(0));
            tempCards.remove(tableAbgleich.get(1));
            tempCards.remove(tableAbgleich.get(2));
            tempCards.remove(tableAbgleich.get(3));
            tempCards.remove(tableAbgleich.get(4));
            Collections.shuffle(tempCards); // mischen

            for(int i=0; i<500; i++){
                Collections.shuffle(tempCards); // mischen
                Map<Integer, List<String>> winningHands = handEvaluator.evaluateHend(
                    List.of(
                        List.of(handAbgleich.get(0), handAbgleich.get(1)),
                        List.of(tempCards.get(2), tempCards.get(3)),
                        List.of(tempCards.get(4), tempCards.get(5)),
                        List.of(tempCards.get(6), tempCards.get(7))),
                    List.of(tableAbgleich.get(0),tableAbgleich.get(1),tableAbgleich.get(2),tableAbgleich.get(3),tableAbgleich.get(4))
                );
                if (winningHands.containsKey(0)) {
                    winns++;
                }
            }
        }


        System.out.println("winns: "+winns);
        System.out.println((double) winns * 100.0 / 500);

        return (double) winns * 100.0 / 500;
    } 

    public List<Integer> getWinner(ArrayList<Player> players, List<String> tableCards) {
        List<Integer> winners = new ArrayList<>();

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
            winners.add(entry.getKey());
        }

        return winners;
    }

    public Map<String, Object> dealCards(ArrayList<Player> players) {
        ArrayList<String> tempCards = new ArrayList<>(playingcards);
        Collections.shuffle(tempCards);
        ArrayList<String> tableCards = new ArrayList<>();

        for (int i = 0; i < 4; i++) {
            players.get(i).setCards(new ArrayList<>(Arrays.asList(tempCards.get(2 * i), tempCards.get(2 * i + 1))));
        }

        for (int i = 8; i <= 12; i++) {
            tableCards.add(tempCards.get(i));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("players", players);
        result.put("tableCards", tableCards);
        return result;
    }

    public ArrayList<Player> setUpPlayers(int buyIn) {
        Random rand = new Random();
        ArrayList<Player> players = new ArrayList<>();
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

            NPC npc = new NPC(style, pokerSpielerinnenNamen.get(rand.nextInt(pokerSpielerinnenNamen.size())), tightness, bluffFactor, position.remove(rand.nextInt(position.size())), null, buyIn, i, 0, null);
            players.add(npc);
        }
        players.add(new Player(position.get(0), null, buyIn, true, 3,0, null));
        players.sort(Comparator.comparing(Player::getPosition));

        return players;
    }

    public Map<String, Object> getNPCDecision(int potGroesse, int callAmount, int bigBlind, List<String> tableCards, List<String> handCards, int round, String style, int stack, int position) {
        double chanche = winnChanche(handCards, tableCards, round);
        Map<String, Object> result = new HashMap<>();
        NPCLogic npcLogic = new NPCLogic();
        NPCEntscheidung npcEntscheidung = npcLogic.entscheideAktion(chanche, style, potGroesse, callAmount, stack, position, bigBlind);
        result.put("action", npcEntscheidung.getAktion());
        result.put("amount", npcEntscheidung.getAmount());
        return result;
    }
}
