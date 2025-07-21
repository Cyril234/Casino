package com.example.casinobackend.Games.Poker;

import java.util.ArrayList;

public class NPC extends Player{
    private String style;
    private String name;
    private double tightness;
    private double bluffFactor;
    
    public NPC(String style, String name, double tightness, double bluffFactor, int position, ArrayList<String> cards, int chips, int id) {
        super(position, cards, chips, false, id);
        this.style = style;
        this.name = name;
        this.tightness = tightness;
        this.bluffFactor = bluffFactor;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getTightness() {
        return tightness;
    }

    public void setTightness(int tightness) {
        this.tightness = tightness;
    }

    public double getBluffFactor() {
        return bluffFactor;
    }

    public void setBluffFactor(int bluffFactor) {
        this.bluffFactor = bluffFactor;
    }
}
