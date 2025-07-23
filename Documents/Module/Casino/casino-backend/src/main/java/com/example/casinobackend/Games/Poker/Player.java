package com.example.casinobackend.Games.Poker;

import java.util.ArrayList;

public class Player {
    private int position;
    private ArrayList<String> cards;
    private int chips;
    protected boolean isPlayer;
    private int amount=0;
    private Aktion aktion; 
    
    public Player(int position, ArrayList<String> cards, int chips, boolean isPlayer, int id, int amount, Aktion aktion) {
        this.position = position;
        this.cards = cards;
        this.chips = chips;
        this.isPlayer = isPlayer;
        this.amount = amount;
        this.aktion = aktion;
    }
    
    public int getPosition() {
        return position;
    }
    public void setPosition(int position) {
        this.position = position;
    }
    public ArrayList<String> getCards() {
        return cards;
    }
    public void setCards(ArrayList<String> cards) {
        this.cards = cards;
    }
    public int getChips() {
        return chips;
    }
    public void setChips(int chips) {
        this.chips = chips;
    }
    public boolean isPlayer() {
        return isPlayer;
    }
    public void setPlayer(boolean isPlayer) {
        this.isPlayer = isPlayer;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public Aktion getAktion() {
        return aktion;
    }

    public void setAktion(Aktion aktion) {
        this.aktion = aktion;
    }
}
