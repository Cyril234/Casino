package com.example.casinobackend.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.example.casinobackend.entities.Game;
import com.example.casinobackend.entities.Player;
import com.example.casinobackend.repositories.GameRepository;
import com.example.casinobackend.repositories.PlayerRepository;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;

@Component
public class Dataloader implements ApplicationRunner {

    @Autowired
    private PlayerRepository playerRepository;
    
    @Autowired
    private GameRepository gameRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        Argon2 argon2 = Argon2Factory.create();

        if (!playerRepository.findByUsername("cyril").isPresent()) {
            Player player1 = new Player();
            player1.setUsername("cyril");
            player1.setEmail("cyril@example.com");
            player1.setPassword(argon2.hash(2, 65536, 1, "cyril234".toCharArray()));
            player1.setCoins(500);
            player1.setColortheme(com.example.casinobackend.enums.Colortheme.LIGHT);
            player1.setVolume(40);
            player1.setSoundstatus(com.example.casinobackend.enums.Soundstatus.ON);
            player1.setBadgenumber("12345");
            player1.setLogins(1);
            player1.setToken("");
            playerRepository.save(player1);
        }

        if (!playerRepository.findByUsername("anna").isPresent()) {
            Player player2 = new Player();
            player2.setUsername("anna");
            player2.setEmail("anna@example.com");
            player2.setPassword(argon2.hash(2, 65536, 1, "anna123".toCharArray()));
            player2.setCoins(57);
            player2.setColortheme(com.example.casinobackend.enums.Colortheme.DARK);
            player2.setVolume(25);
            player2.setSoundstatus(com.example.casinobackend.enums.Soundstatus.OFF);
            player2.setBadgenumber("23456");
            player2.setLogins(3);
            player2.setToken("");
            playerRepository.save(player2);
        }

        if (!playerRepository.findByUsername("bob").isPresent()) {
            Player player3 = new Player();
            player3.setUsername("bob");
            player3.setEmail("bob@example.com");
            player3.setPassword(argon2.hash(2, 65536, 1, "bob456".toCharArray()));
            player3.setCoins(1220);
            player3.setColortheme(com.example.casinobackend.enums.Colortheme.LIGHT);
            player3.setVolume(80);
            player3.setSoundstatus(com.example.casinobackend.enums.Soundstatus.ON);
            player3.setBadgenumber("34567");
            player3.setLogins(5);
            player3.setToken("");
            playerRepository.save(player3);
        }

        if (!playerRepository.findByUsername("emily").isPresent()) {
            Player player4 = new Player();
            player4.setUsername("emily");
            player4.setEmail("emily@example.com");
            player4.setPassword(argon2.hash(2, 65536, 1, "emily789".toCharArray()));
            player4.setCoins(4800);
            player4.setColortheme(com.example.casinobackend.enums.Colortheme.DARK);
            player4.setVolume(60);
            player4.setSoundstatus(com.example.casinobackend.enums.Soundstatus.ON);
            player4.setBadgenumber("45678");
            player4.setLogins(2);
            player4.setToken("");
            playerRepository.save(player4);
        }

        if (!playerRepository.findByUsername("daniel").isPresent()) {
            Player player5 = new Player();
            player5.setUsername("daniel");
            player5.setEmail("daniel@example.com");
            player5.setPassword(argon2.hash(2, 65536, 1, "daniel234".toCharArray()));
            player5.setCoins(23900);
            player5.setColortheme(com.example.casinobackend.enums.Colortheme.LIGHT);
            player5.setVolume(100);
            player5.setSoundstatus(com.example.casinobackend.enums.Soundstatus.OFF);
            player5.setBadgenumber("56789");
            player5.setLogins(8);
            player5.setToken("");
            playerRepository.save(player5);
        }

        if (!playerRepository.findByUsername("lisa").isPresent()) {
            Player player6 = new Player();
            player6.setUsername("lisa");
            player6.setEmail("lisa@example.com");
            player6.setPassword(argon2.hash(2, 65536, 1, "lisa999".toCharArray()));
            player6.setCoins(48950);
            player6.setColortheme(com.example.casinobackend.enums.Colortheme.DARK);
            player6.setVolume(15);
            player6.setSoundstatus(com.example.casinobackend.enums.Soundstatus.ON);
            player6.setBadgenumber("67890");
            player6.setLogins(12);
            player6.setToken("");
            playerRepository.save(player6);
        }

        if (!playerRepository.findByUsername("tom").isPresent()) {
            Player player7 = new Player();
            player7.setUsername("tom");
            player7.setEmail("tom@example.com");
            player7.setPassword(argon2.hash(2, 65536, 1, "tom111".toCharArray()));
            player7.setCoins(7320);
            player7.setColortheme(com.example.casinobackend.enums.Colortheme.LIGHT);
            player7.setVolume(50);
            player7.setSoundstatus(com.example.casinobackend.enums.Soundstatus.ON);
            player7.setBadgenumber("78901");
            player7.setLogins(4);
            player7.setToken("");
            playerRepository.save(player7);
        }

        if (!playerRepository.findByUsername("sophia").isPresent()) {
            Player player8 = new Player();
            player8.setUsername("sophia");
            player8.setEmail("sophia@example.com");
            player8.setPassword(argon2.hash(2, 65536, 1, "sophia222".toCharArray()));
            player8.setCoins(215);
            player8.setColortheme(com.example.casinobackend.enums.Colortheme.DARK);
            player8.setVolume(70);
            player8.setSoundstatus(com.example.casinobackend.enums.Soundstatus.OFF);
            player8.setBadgenumber("89012");
            player8.setLogins(2);
            player8.setToken("");
            playerRepository.save(player8);
        }

        if (!playerRepository.findByUsername("max").isPresent()) {
            Player player9 = new Player();
            player9.setUsername("max");
            player9.setEmail("max@example.com");
            player9.setPassword(argon2.hash(2, 65536, 1, "max333".toCharArray()));
            player9.setCoins(18400);
            player9.setColortheme(com.example.casinobackend.enums.Colortheme.LIGHT);
            player9.setVolume(30);
            player9.setSoundstatus(com.example.casinobackend.enums.Soundstatus.ON);
            player9.setBadgenumber("90123");
            player9.setLogins(6);
            player9.setToken("");
            playerRepository.save(player9);
        }

        if (!playerRepository.findByUsername("mia").isPresent()) {
            Player player10 = new Player();
            player10.setUsername("mia");
            player10.setEmail("mia@example.com");
            player10.setPassword(argon2.hash(2, 65536, 1, "mia444".toCharArray()));
            player10.setCoins(90);
            player10.setColortheme(com.example.casinobackend.enums.Colortheme.DARK);
            player10.setVolume(20);
            player10.setSoundstatus(com.example.casinobackend.enums.Soundstatus.OFF);
            player10.setBadgenumber("12398");
            player10.setLogins(1);
            player10.setToken("");
            playerRepository.save(player10);
        }

        if (!playerRepository.findByUsername("gast").isPresent()) {
            Player player = new Player();
            player.setUsername("gast");
            player.setCoins(1000);
            player.setColortheme(com.example.casinobackend.enums.Colortheme.LIGHT);
            player.setVolume(40);
            player.setSoundstatus(com.example.casinobackend.enums.Soundstatus.ON);
            player.setLogins(1);
            player.setToken("");
            playerRepository.save(player);
        }
        ;

        if (!gameRepository.findByTitle("Blackjack").isPresent()) {
            Game game1 = new Game();
            game1.setTitle("Blackjack");
            gameRepository.save(game1);
        }

        if (!gameRepository.findByTitle("Mienenfeld").isPresent()) {
            Game game2 = new Game();
            game2.setTitle("Mienenfeld");
            gameRepository.save(game2);
        }

        if (!gameRepository.findByTitle("Pferderennen").isPresent()) {
            Game game3 = new Game();
            game3.setTitle("Pferderennen");
            gameRepository.save(game3);
        }

        if (!gameRepository.findByTitle("Roulette").isPresent()) {
            Game game4 = new Game();
            game4.setTitle("Roulette");
            gameRepository.save(game4);
        }
    }
}
