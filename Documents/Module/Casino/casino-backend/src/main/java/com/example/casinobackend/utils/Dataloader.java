package com.example.casinobackend.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component; // Wichtig!

import com.example.casinobackend.entities.Player;
import com.example.casinobackend.repositories.PlayerRepository;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;

@Component
public class Dataloader implements ApplicationRunner {

    @Autowired
    private PlayerRepository playerRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        Argon2 argon2 = Argon2Factory.create();

        // Prüfen, ob User existiert (optional, aber sinnvoll)
        if (playerRepository.findByUsername("cyril").isPresent()) return;

        Player player = new Player();
        player.setUsername("cyril");
        player.setEmail("cyril@example.com");
        player.setPassword(argon2.hash(2, 65536, 1, "cyril234".toCharArray()));
        player.setCoins(500);
        player.setColortheme(com.example.casinobackend.enums.Colortheme.LIGHT);
        player.setVolume(40);
        player.setSoundstatus(com.example.casinobackend.enums.Soundstatus.ON);
        player.setBadgenumber("12345");
        player.setLogins(1);
        player.setToken("");
        // Avatar und Playingattempts können bei Bedarf gesetzt werden

        playerRepository.save(player);
    }
}