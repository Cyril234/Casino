package com.example.casinobackend.Games.Poker;
import java.util.Random;

public class NPCLogic {

    // Klasse für das Entscheidungsergebnis
    public static class NPCEntscheidung {
        private Aktion aktion;
        private int amount; // Chips für RAISE oder ALL_IN
        
        public NPCEntscheidung(Aktion aktion, int amount) {
            this.aktion = aktion;
            this.amount = amount;
        }

        public Aktion getAktion() { return aktion; }
        public int getAmount() { 
            System.out.println("amount: " + amount);
            return amount; 
        }
        
        @Override
        public String toString() {
            switch (aktion) {
                case RAISE:   return "RAISE (" + amount + " Chips)";
                case ALL_IN:  return "ALL_IN (" + amount + " Chips)";
                default:      return aktion.toString();
            }
        }
    }
    
    private Random random = new Random();
    
    /**
     * Hauptfunktion zur NPC-Entscheidung mit verbesserter Logik
     *
     * @param handstaerke Gewinnwahrscheinlichkeit in Prozent (0-100)
     * @param spielstil   Spielstil des NPCs ("aggressive", "normal", "tight")
     * @param potGroesse  Aktuelle Pot-Größe in Chips
     * @param callAmount  Betrag zum Mitgehen in Chips
     * @param npcStack    Verbleibende Chips des NPCs
     * @param position    Position am Tisch (0 = Early, 3 = Late)
     * @param bigBlind    Höhe des Big Blinds
     * @return NPCEntscheidung mit Aktion und ggf. Betrag
     */
    public NPCEntscheidung entscheideAktion(
            double handstaerke,
            String spielstil,
            int potGroesse,
            int callAmount,
            int npcStack,
            int position,
            int bigBlind) {

        System.out.println("NPC Entscheidung - Hand: " + handstaerke + "%, Stil: " + spielstil + 
                          ", Stack: " + npcStack + " (" + (npcStack/bigBlind) + " BB)");
        
        // 1) Break-Even Equity (Bruch)
        double breakEvenEquity = callAmount > 0 ? (double) callAmount / (potGroesse + callAmount) : 0;
        
        // 2) Verbesserte Style-Faktoren (weniger extreme Werte)
        double foldFaktor  = getFoldFaktor(spielstil);
        double raiseFaktor = getRaiseFaktor(spielstil);
        
        // 3) Positionsanpassung
        double posAdjust = getPositionsAdjustment(position);
        
        // 4) Schwellen berechnen
        double foldSchwelle  = Math.max(5, (foldFaktor * breakEvenEquity + posAdjust) * 100);
        double raiseSchwelle = Math.min(85, (raiseFaktor * breakEvenEquity + posAdjust) * 100);
        
        // 5) Verbesserte Stack-Kategorisierung
        boolean microStack = npcStack <= 8 * bigBlind;   // Sehr klein: <8 BB
        boolean shortStack = npcStack > 8 * bigBlind && npcStack <= 18 * bigBlind; // Klein: 8-18 BB
        boolean mediumStack = npcStack > 18 * bigBlind && npcStack <= 35 * bigBlind; // Mittel: 18-35 BB
        // Großer Stack: >35 BB
        
        // 6) Handstärke mit Variation
        double variation = random.nextGaussian() * 2.0; // Etwas weniger Variation
        double adjustedHand = Math.max(0, Math.min(100, handstaerke + variation));
        
        // 7) Verbesserte Entscheidungslogik
        
        // FOLD-Bereich: Aber nicht zu oft folden
        if (adjustedHand < foldSchwelle) {
            // Gelegentliche "Neugier-Calls" statt Folds
            double curiosityCallChance = getCuriosityCallChance(spielstil, position, adjustedHand, foldSchwelle);
            if (random.nextDouble() < curiosityCallChance && callAmount <= npcStack) {
                System.out.println("Neugier-Call statt Fold bei " + adjustedHand + "%");
                return new NPCEntscheidung(Aktion.CALL, 0);
            }
            return new NPCEntscheidung(Aktion.FOLD, 0);
        }
        
        // RAISE/ALL-IN Bereich: Starke Hände
        if (adjustedHand >= raiseSchwelle) {
            return handleStarkeHand(adjustedHand, spielstil, microStack, shortStack, 
                                  potGroesse, callAmount, npcStack, bigBlind);
        }
        
        // MEDIUM Bereich: Call oder gelegentlicher Bluff-Raise
        return handleMittlereHand(adjustedHand, spielstil, position, potGroesse, 
                                callAmount, npcStack, bigBlind, microStack);
    }
    
    /**
     * Verbesserte Fold-Faktoren (weniger extrem)
     */
    private double getFoldFaktor(String stil) {
        switch(stil) {
            case "aggressive": return 0.5;  // War 0.8 - jetzt aggressiver
            case "normal":     return 0.65; // War 1.0 - etwas aggressiver
            case "tight":      return 0.9;  // War 1.2 - weniger tight
            default:           return 0.65;
        }
    }
    
    /**
     * Verbesserte Raise-Faktoren (realistischere Schwellen)
     */
    private double getRaiseFaktor(String stil) {
        switch(stil) {
            case "aggressive": return 1.1;  // War 1.2 - etwas niedriger
            case "normal":     return 1.4;  // War 1.5 - leicht niedriger
            case "tight":      return 1.7;  // War 2.0 - deutlich niedriger
            default:           return 1.4;
        }
    }
    
    private double getPositionsAdjustment(int position) {
        switch (position) {
            case 0: return  0.05;  // Early: +5%
            case 1: return  0.02;  // Middle-Early: +2%
            case 2: return -0.03;  // Middle-Late: -3%
            case 3: return -0.08;  // Late: -8%
            default: return  0.0;
        }
    }
    
    /**
     * Berechnet Wahrscheinlichkeit für "Neugier-Calls"
     */
    private double getCuriosityCallChance(String spielstil, int position, 
                                        double adjustedHand, double foldSchwelle) {
        double baseChance;
        switch(spielstil) {
            case "aggressive": baseChance = 0.12; break; // 12% Chance
            case "normal":     baseChance = 0.06; break; // 6% Chance
            case "tight":      baseChance = 0.02; break; // 2% Chance
            default:           baseChance = 0.05; break;
        }
        
        // Späte Position = mehr Calls
        if (position >= 2) baseChance *= 1.5;
        
        // Wenn Hand nur knapp unter Fold-Schwelle, höhere Chance
        if (adjustedHand > foldSchwelle - 5) baseChance *= 2.0;
        
        return Math.min(0.20, baseChance); // Max 20%
    }
    
    /**
     * Behandlung starker Hände mit verbesserter All-In Logik
     */
    private NPCEntscheidung handleStarkeHand(double adjustedHand, String spielstil, 
                                           boolean microStack, boolean shortStack,
                                           int potGroesse, int callAmount, 
                                           int npcStack, int bigBlind) {
        
        // Micro Stack (<8 BB): Fast immer All-In
        if (microStack) {
            System.out.println("Micro-Stack All-In mit " + adjustedHand + "%");
            return new NPCEntscheidung(Aktion.ALL_IN, npcStack);
        }
        
        // Short Stack (8-18 BB): Selektiv All-In
        if (shortStack) {
            double allInChance = getAllInChanceShortStack(adjustedHand, spielstil);
            if (random.nextDouble() < allInChance) {
                System.out.println("Short-Stack All-In (" + allInChance*100 + "% Chance)");
                return new NPCEntscheidung(Aktion.ALL_IN, npcStack);
            }
        }
        
        // Standard Raise (auch bei short stack wenn nicht All-In gewählt)
        int raiseAmount = berechneRaiseAmount(spielstil, potGroesse, callAmount, 
                                            npcStack, adjustedHand, bigBlind);

        System.out.println("Standard Raise: " + raiseAmount);

        return new NPCEntscheidung(Aktion.RAISE, raiseAmount);
    }
    
    /**
     * Berechnet All-In Wahrscheinlichkeit für Short Stacks
     */
    private double getAllInChanceShortStack(double handstaerke, String spielstil) {
        double baseChance;
        
        // Je stärker die Hand, desto eher All-In
        if (handstaerke >= 85) {
            baseChance = 0.8; // 80% bei sehr starken Händen
        } else if (handstaerke >= 70) {
            baseChance = 0.5; // 50% bei starken Händen
        } else {
            baseChance = 0.25; // 25% bei ok Händen
        }
        
        // Spielstil-Anpassung
        switch(spielstil) {
            case "aggressive": return Math.min(0.9, baseChance * 1.3);
            case "normal":     return baseChance;
            case "tight":      return baseChance * 0.7;
            default:           return baseChance;
        }
    }
    
    /**
     * Behandlung mittlerer Hände
     */
    private NPCEntscheidung handleMittlereHand(double adjustedHand, String spielstil, 
                                             int position, int potGroesse, int callAmount,
                                             int npcStack, int bigBlind, boolean microStack) {
        
        // Micro Stack: Lieber All-In als Call
        if (microStack && adjustedHand > 35) {
            System.out.println("Micro-Stack Push mit mittlerer Hand");
            return new NPCEntscheidung(Aktion.ALL_IN, npcStack);
        }
        
        // Bluff-Raise Chance (für alle Stile)
        double bluffChance = getBluffRaiseChance(spielstil, position, adjustedHand);
        if (random.nextDouble() < bluffChance && callAmount < npcStack * 0.3) {
            int bluffAmount = berechneBluffAmount(potGroesse, callAmount, bigBlind, npcStack);
            System.out.println("Bluff-Raise (" + bluffChance*100 + "% Chance)");
            return new NPCEntscheidung(Aktion.RAISE, bluffAmount);
        }
        
        // Standard Call
        if (callAmount <= npcStack) {
            return new NPCEntscheidung(Aktion.CALL, 0);
        } else {
            return new NPCEntscheidung(Aktion.FOLD, 0);
        }
    }
    
    /**
     * Berechnet Bluff-Raise Wahrscheinlichkeit
     */
    private double getBluffRaiseChance(String spielstil, int position, double handstaerke) {
        double baseChance;
        switch(spielstil) {
            case "aggressive": baseChance = 0.18; break; // 18%
            case "normal":     baseChance = 0.08; break; // 8%
            case "tight":      baseChance = 0.03; break; // 3%
            default:           baseChance = 0.08; break;
        }
        
        // Späte Position = mehr Bluffs
        if (position >= 2) baseChance *= 1.4;
        
        // Bessere mittlere Hände = weniger Bluffs (Semi-Bluff Konzept)
        if (handstaerke > 50) baseChance *= 0.7;
        
        return Math.min(0.25, baseChance);
    }
    
    /**
     * Verbesserte Raise-Betrag Berechnung
     */
    private int berechneRaiseAmount(String stil, int pot, int call, int stack, 
                                  double hand, int bigBlind) {
        // Basis Pot-Faktor
        double potFaktor;
        switch(stil) {
            case "aggressive": potFaktor = 0.9; break;  // War 1.0
            case "normal":     potFaktor = 0.6; break;  // War 0.66  
            case "tight":      potFaktor = 0.45; break; // War 0.5
            default:           potFaktor = 0.6; break;
        }
        
        // Handstärke-Modifier (weniger extrem)
        if (hand > 90)       potFaktor *= 1.8;      // War 2.0
        else if (hand > 80)  potFaktor *= 1.3;      // War 1.5
        else if (hand > 65)  potFaktor *= 1.1;      // Neu: moderate Verstärkung
        
        // Stack-Anpassung: Größere Stacks können mehr riskieren
        if (stack > 50 * bigBlind) potFaktor *= 1.2;
        else if (stack < 20 * bigBlind) potFaktor *= 0.8;
        
        // Weniger Zufallsvariation
        potFaktor *= 1.0 + (random.nextGaussian() * 0.08); // War 0.1
        
        int amount = call + (int) Math.round(potFaktor * pot);
        
        // Mindest-Raise und Limits
        int minRaise = call + Math.max(bigBlind, pot / 10); // Dynamisches Minimum
        int maxRaise = Math.min(stack, call + pot * 2); // Maximal 2x Pot
        
        amount = Math.max(minRaise, Math.min(maxRaise, amount));
        
        System.out.println("Raise berechnet: " + amount + " (Faktor: " + 
                          String.format("%.2f", potFaktor) + ")");
        return amount;
    }
    
    /**
     * Verbesserte Bluff-Betrag Berechnung
     */
    private int berechneBluffAmount(int pot, int call, int bigBlind, int stack) {
        // Kleinere Bluffs (33-60% statt 33-50%)
        double bluffFaktor = 0.33 + random.nextDouble() * 0.27; // 33-60%
        int amount = call + (int) Math.round(bluffFaktor * pot);
        
        // Limits
        int minBluff = call + bigBlind;
        int maxBluff = Math.min(stack, call + (int)(pot * 0.8));
        
        return Math.max(minBluff, Math.min(maxBluff, amount));
    }
    
    /**
     * Erweiterte Entscheidungsdetails für Debugging
     */
    public String getEntscheidungsDetails(double handstaerke, String spielstil,
                                        int potGroesse, int callAmount,
                                        int position, int bigBlind, int npcStack) {
        double breakEven = callAmount > 0 ? (double) callAmount / (potGroesse + callAmount) * 100 : 0;
        double foldSchw = Math.max(5, (getFoldFaktor(spielstil) * breakEven/100 + getPositionsAdjustment(position)) * 100);
        double raiseSchw = Math.min(85, (getRaiseFaktor(spielstil) * breakEven/100 + getPositionsAdjustment(position)) * 100);
        
        String stackInfo = npcStack <= 8 * bigBlind ? "MICRO" :
                          npcStack <= 18 * bigBlind ? "SHORT" :
                          npcStack <= 35 * bigBlind ? "MEDIUM" : "BIG";
        
        return String.format("Break-Even: %.1f%% | Fold: %.1f%% | Raise: %.1f%% | Hand: %.1f%% | Stack: %s (%.1f BB)",
                            breakEven, foldSchw, raiseSchw, handstaerke, stackInfo, (double)npcStack/bigBlind);
    }
}
