package com.example.casinobackend.Games.Pferderennen;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Pferd {
    @Id
    private int id;
    private String name;
    private double winProbability;
    private String description;

    public Pferd(int id, String name, double winProbability, String description) {
        this.id = id;
        this.name = name;
        this.winProbability = winProbability;
        this.description = description;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getWinProbability() {
        return winProbability;
    }

    public void setWinProbability(double winProbability) {
        this.winProbability = winProbability;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
