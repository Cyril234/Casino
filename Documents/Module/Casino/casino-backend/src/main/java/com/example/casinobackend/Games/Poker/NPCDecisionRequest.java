package com.example.casinobackend.Games.Poker;

import java.util.List;

public class NPCDecisionRequest {
    private int potGroesse;
    private int callAmount;
    private int bigBlind;
    private List<String> tableCards;
    private List<String> handCards;
    private int round;
    private String style;
    private int stack;
    private int position;

    // Getters and setters
    public int getPotGroesse() { return potGroesse; }
    public void setPotGroesse(int potGroesse) { this.potGroesse = potGroesse; }

    public int getCallAmount() { return callAmount; }
    public void setCallAmount(int callAmount) { this.callAmount = callAmount; }

    public int getBigBlind() { return bigBlind; }
    public void setBigBlind(int bigBlind) { this.bigBlind = bigBlind; }

    public List<String> getTableCards() { return tableCards; }
    public void setTableCards(List<String> tableCards) { this.tableCards = tableCards; }

    public List<String> getHandCards() { return handCards; }
    public void setHandCards(List<String> handCards) { this.handCards = handCards; }

    public int getRound() { return round; }
    public void setRound(int round) { this.round = round; }

    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }

    public int getStack() { return stack; }
    public void setStack(int stack) { this.stack = stack; }

    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }
}