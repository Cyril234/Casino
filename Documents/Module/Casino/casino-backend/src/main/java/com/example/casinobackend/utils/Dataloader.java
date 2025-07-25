package com.example.casinobackend.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.example.casinobackend.entities.Avatar;
import com.example.casinobackend.entities.Game;
import com.example.casinobackend.entities.Player;
import com.example.casinobackend.enums.Eyecolor;
import com.example.casinobackend.enums.Haircolor;
import com.example.casinobackend.enums.Headgear;
import com.example.casinobackend.enums.Shirt;
import com.example.casinobackend.enums.Shoes;
import com.example.casinobackend.enums.Skincolor;
import com.example.casinobackend.enums.Trouserscolor;
import com.example.casinobackend.enums.Trouserstype;
import com.example.casinobackend.repositories.AvatarRepository;
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

    @Autowired
    private AvatarRepository avatarRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        Argon2 argon2 = Argon2Factory.create();

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

            if (!avatarRepository.findByPlayer(player).isPresent()) {
                Avatar avatar = new Avatar();
                avatar.setName("Gastavatar");
                avatar.setDescription("Ich bin der Avatar des Gastspielers.");
                avatar.setHaircolor(Haircolor.BLACK);
                avatar.setShirt(Shirt.BLACK);
                avatar.setEyecolor(Eyecolor.BROWN);
                avatar.setHeadgear(Headgear.WITHOUT);
                avatar.setBeard(false);
                avatar.setPlayer(player);
                avatar.setTrouserscolor(Trouserscolor.GRAY);
                avatar.setTrouserstype(Trouserstype.LONG);
                avatar.setShoes(Shoes.SNEAKERS);
                avatar.setSkincolor(Skincolor.WHITE);
                avatarRepository.save(avatar);
            }
        }
        ;

        if (!gameRepository.findByTitle("Blackjack").isPresent()) {
            Game game1 = new Game();
            game1.setTitle("Blackjack");
            gameRepository.save(game1);
        }

        if (!gameRepository.findByTitle("Minenfeld").isPresent()) {
            Game game2 = new Game();
            game2.setTitle("Minenfeld");
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
        if (!gameRepository.findByTitle("Slot").isPresent()) {
            Game game6 = new Game();
            game6.setTitle("Slot");
            gameRepository.save(game6);
        }
    }
}
