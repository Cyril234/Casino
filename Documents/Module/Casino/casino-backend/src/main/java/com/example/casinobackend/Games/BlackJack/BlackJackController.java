package com.example.casinobackend.Games.BlackJack;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.casinobackend.entities.Game;
import com.example.casinobackend.entities.Player;
import com.example.casinobackend.repositories.GameRepository;
import com.example.casinobackend.repositories.PlayerRepository;

@RestController
@RequestMapping("/blackjack")
@CrossOrigin(origins = "http://localhost:5173")
public class BlackJackController {

    private final PlayerRepository playerRepo;
    private final GameRepository gameRepo;
    private final BlackJackRepository blackjackRepo;

    public BlackJackController(PlayerRepository playerRepo, GameRepository gameRepo, BlackJackRepository blackjackRepo) {
        this.playerRepo = playerRepo;
        this.gameRepo = gameRepo;
        this.blackjackRepo = blackjackRepo;
    }

    @PostMapping("/{playerId}/start")
    public Map<String, Object> startGame(@PathVariable Long playerId, @RequestParam int coins) {
        Player player = playerRepo.findById(playerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found"));
        Game game = gameRepo.findByTitle("Blackjack").orElseThrow();
        return blackjackRepo.startGame(player, game, coins);
    }

    @PostMapping("/{playerId}/hit")
    public Map<String, Object> hit(@PathVariable Long playerId) {
        Player player = playerRepo.findById(playerId).orElseThrow();
        return blackjackRepo.hit(player);
    }

    @PostMapping("/{playerId}/stand")
    public Map<String, Object> stand(@PathVariable Long playerId) {
        Player player = playerRepo.findById(playerId).orElseThrow();
        return blackjackRepo.stand(player);
    }

    @PostMapping("/{playerId}/double")
    public ResponseEntity<Map<String, Object>> doubleDown(@PathVariable Long playerId) {
        Player player = playerRepo.findById(playerId)
                .orElseThrow(() -> new IllegalArgumentException("Spieler nicht gefunden"));
        Map<String, Object> result = blackjackRepo.doubleDown(player);
        return ResponseEntity.ok(result);
    }

}
