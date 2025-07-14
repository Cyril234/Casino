package com.example.casinobackend.Games.BlackJack;

import java.util.Map;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.casinobackend.entities.Game;
import com.example.casinobackend.entities.Player;
import com.example.casinobackend.entities.Playingattempt;
import com.example.casinobackend.repositories.GameRepository;
import com.example.casinobackend.repositories.PlayerRepository;
import com.example.casinobackend.repositories.PlayingattemptRepository;

@RestController
@RequestMapping("/blackjack")
public class BlackJackController {

    private final PlayerRepository playerRepo;
    private final GameRepository gameRepo;
    private final PlayingattemptRepository attemptRepo;
    private final BlackJackRepository blackjackRepo;

    public BlackJackController(PlayerRepository playerRepo, GameRepository gameRepo,
                               PlayingattemptRepository attemptRepo, BlackJackRepository blackjackRepo) {
        this.playerRepo = playerRepo;
        this.gameRepo = gameRepo;
        this.attemptRepo = attemptRepo;
        this.blackjackRepo = blackjackRepo;
    }

    @PostMapping("/{playerId}/start")
    public Playingattempt startGame(@PathVariable Long playerId, @RequestParam int coins) {
        Player player = playerRepo.findById(playerId).orElseThrow();
        Game game = gameRepo.findByTitle("Blackjack").orElseThrow();

        Playingattempt attempt = blackjackRepo.startGame(player, game, coins);
        return attemptRepo.save(attempt);
    }

    @PostMapping("/{playerId}/hit")
    public Map<String, Object> hit(@PathVariable Long playerId) {
        Player player = playerRepo.findById(playerId).orElseThrow();
        return blackjackRepo.hit(player);
    }

    @PostMapping("/{playerId}/stand")
    public Playingattempt stand(@PathVariable Long playerId) {
        Player player = playerRepo.findById(playerId).orElseThrow();
        Playingattempt result = blackjackRepo.stand(player);
        return attemptRepo.save(result);
    }
}
