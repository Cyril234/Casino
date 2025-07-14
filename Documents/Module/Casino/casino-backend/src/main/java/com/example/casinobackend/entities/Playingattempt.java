package com.example.casinobackend.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "playingattempt")
public class Playingattempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "playingattempt_id")
    private Long playingattemptId;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @Column(name = "settedcoins", nullable = false)
    private int settedcoins;

    @Column(name = "finishingbalance", nullable = false)
    private int finishingbalance;

    @ManyToOne
    private Player player;

    @ManyToOne
    private Game game;

    public Long getPlayingattemptId() {
        return playingattemptId;
    }

    public void setPlayingattemptId(Long playingattemptId) {
        this.playingattemptId = playingattemptId;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public int getSettedcoins() {
        return settedcoins;
    }

    public void setSettedcoins(int settedcoins) {
        this.settedcoins = settedcoins;
    }

    public int getFinishingbalance() {
        return finishingbalance;
    }

    public void setFinishingbalance(int finishingbalance) {
        this.finishingbalance = finishingbalance;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

}
