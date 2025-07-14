package com.example.casinobackend.entities;

import java.util.HashSet;
import java.util.Set;

import com.example.casinobackend.enums.Colortheme;
import com.example.casinobackend.enums.Soundstatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "player")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "player_id")
    private Long playerId;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "coins", nullable = false)
    private int coins;

    @Column(name = "colortheme", nullable = false)
    private Colortheme colortheme;

    @Column(name = "volume", nullable = false)
    private int volume;

    @Column(name = "soundstatus", nullable = false)
    private Soundstatus soundstatus;

    @Column(name = "badgenumber", nullable = true)
    private String badgenumber;

    @Column(name = "logins", nullable = false)
    private int logins;

    @OneToOne(mappedBy = "player")
    private Avatar avatar;

    @OneToMany(mappedBy = "player")
    private Set<Playingattempt> playingattempts = new HashSet<>();

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getCoins() {
        return coins;
    }

    public void setCoins(int coins) {
        this.coins = coins;
    }

    public Colortheme getColortheme() {
        return colortheme;
    }

    public void setColortheme(Colortheme colortheme) {
        this.colortheme = colortheme;
    }

    public int getVolume() {
        return volume;
    }

    public void setVolume(int volume) {
        this.volume = volume;
    }

    public Soundstatus getSoundstatus() {
        return soundstatus;
    }

    public void setSoundstatus(Soundstatus soundstatus) {
        this.soundstatus = soundstatus;
    }

    public String getBadgenumber() {
        return badgenumber;
    }

    public void setBadgenumber(String badgenumber) {
        this.badgenumber = badgenumber;
    }

    public int getLogins() {
        return logins;
    }

    public void setLogins(int logins) {
        this.logins = logins;
    }

    public Avatar getAvatar() {
        return avatar;
    }

    public void setAvatar(Avatar avatar) {
        this.avatar = avatar;
    }

    public Set<Playingattempt> getPlayingattempts() {
        return playingattempts;
    }

    public void setPlayingattempts(Set<Playingattempt> playingattempts) {
        this.playingattempts = playingattempts;
    }

    public void incrementCoins(int amount) {
        if (amount < 0)
            throw new IllegalArgumentException("Amount must be positive");
        this.coins += amount;
    }

    public void decrementCoins(int amount) {
        if (amount < 0)
            throw new IllegalArgumentException("Amount must be positive");
        if (this.coins < amount)
            throw new IllegalStateException("Not enough coins");
        this.coins -= amount;
    }
    

}
