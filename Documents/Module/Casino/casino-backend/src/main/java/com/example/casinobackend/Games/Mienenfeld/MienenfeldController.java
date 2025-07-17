package com.example.casinobackend.Games.Mienenfeld;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.casinobackend.entities.Game;
import com.example.casinobackend.entities.Player;
import com.example.casinobackend.repositories.GameRepository;
import com.example.casinobackend.repositories.PlayerRepository;

@RestController
@RequestMapping("/mienenfeld")
@CrossOrigin(origins = "http://localhost:5173")
public class MienenfeldController {

    private final PlayerRepository playerRepo;
    private final GameRepository gameRepo;
    private final MienenfeldRepository minesRepo;

    public MienenfeldController(PlayerRepository playerRepo, GameRepository gameRepo, MienenfeldRepository minesRepo) {
        this.playerRepo = playerRepo;
        this.gameRepo = gameRepo;
        this.minesRepo = minesRepo;
    }

    @PostMapping("/{playerId}/start")
    public Map<String, Object> startGame(@PathVariable Long playerId, @RequestParam int bombs, @RequestParam int fields, @RequestParam int coins) {
        Player player = playerRepo.findById(playerId).orElseThrow();
        Game game = gameRepo.findByTitle("Mienenfeld").orElseThrow();
        return minesRepo.startGame(player, game, coins, fields, bombs);
    }

    @PostMapping("/{playerId}/reveal")
    public Map<String, Object> reveal(@PathVariable Long playerId, @RequestParam int index) {
        Player player = playerRepo.findById(playerId).orElseThrow();
        return minesRepo.revealField(player, index);
    }

    @PostMapping("/{playerId}/cashout")
    public Map<String, Object> cashout(@PathVariable Long playerId) {
        Player player = playerRepo.findById(playerId).orElseThrow();
        Game game = gameRepo.findByTitle("Mienenfeld").orElseThrow();
        return minesRepo.cashout(player, game);
    }
}
