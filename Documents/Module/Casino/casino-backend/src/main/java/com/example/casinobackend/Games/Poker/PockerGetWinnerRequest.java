package com.example.casinobackend.Games.Poker;
import java.util.ArrayList;
import java.util.List;

public class PockerGetWinnerRequest {
    private ArrayList<Player> players;
    private List<String> tableCards;

    // Getters and setters
    public ArrayList<Player> getPlayers() {
        return players;
    }

    public void setPlayers(ArrayList<Player> players) {
        this.players = players;
    }

    public List<String> getTableCards() {
        return tableCards;
    }

    public void setTableCards(List<String> tableCards) {
        this.tableCards = tableCards;
    }
}
