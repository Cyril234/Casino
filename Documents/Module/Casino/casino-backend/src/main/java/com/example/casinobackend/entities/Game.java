package com.example.casinobackend.entities;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "game")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "game_id")
    private Long gameId;

    @Column(name = "title", nullable = false)
    private String title;

    @JsonIgnore
    @OneToMany(mappedBy = "game")
    private Set<Playingattempt> playingattempts = new HashSet<>();

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Set<Playingattempt> getPlayingattempts() {
        return playingattempts;
    }

    public void setPlayingattempts(Set<Playingattempt> playingattempts) {
        this.playingattempts = playingattempts;
    }

}
