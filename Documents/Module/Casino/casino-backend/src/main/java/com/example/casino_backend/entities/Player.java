package com.example.casino_backend.entities;

import com.example.casino_backend.enums.Colortheme;
import com.example.casino_backend.enums.Soundstatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    //Skins

}
