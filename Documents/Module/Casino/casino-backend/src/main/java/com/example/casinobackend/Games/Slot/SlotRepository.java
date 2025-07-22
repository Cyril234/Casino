package com.example.casinobackend.Games.Slot;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.casinobackend.entities.Game;
import com.example.casinobackend.entities.Player;
import com.example.casinobackend.entities.Playingattempt;
import com.example.casinobackend.repositories.GameRepository;
import com.example.casinobackend.repositories.PlayingattemptRepository;

import jakarta.transaction.Transactional;

@Repository
public class SlotRepository {

    private static final List<String> SYMBOLS = List.of("cherry", "lemon", "bell", "star", "seven");
    private static final Random RANDOM = new Random();

    @Autowired
    private GameRepository gameRepo;
    @Autowired
    private PlayingattemptRepository playingattemptRepo;

    @Transactional
    public Map<String, Object> spin(Player player, Game game, int betCoins) {
        if (player.getCoins() < betCoins) {
            throw new IllegalArgumentException("Nicht genügend Coins");
        } else if (betCoins <= 0) {
            throw new IllegalArgumentException("Der Einsatz muss größer als 0 sein");
        }

        String[] result = new String[3];
        for (int i = 0; i < 3; i++) {
            result[i] = SYMBOLS.get(RANDOM.nextInt(SYMBOLS.size()));
        }

        boolean win = result[0].equals(result[1]) && result[1].equals(result[2]);
        int coinsWon = win ? betCoins * 3 : 0;

        player.setCoins(player.getCoins() - betCoins + coinsWon);

        Playingattempt attempt = new Playingattempt();
        attempt.setDate(LocalDateTime.now());
        attempt.setGame(game);
        attempt.setPlayer(player);
        attempt.setSettedcoins(betCoins);
        attempt.setFinishingbalance(player.getCoins());

        playingattemptRepo.save(attempt);

        return Map.of(
            "slots", result,
            "win", win,
            "coinsWon", coinsWon,
            "newBalance", player.getCoins()
        );
    }
}
