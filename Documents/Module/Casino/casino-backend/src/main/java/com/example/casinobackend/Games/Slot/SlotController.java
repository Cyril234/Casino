package com.example.casinobackend.Games.Slot;

import java.util.Map;

import org.springframework.http.HttpStatus;
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
@RequestMapping("/slot")
@CrossOrigin(origins = "http://localhost:5173")
public class SlotController {

    private final PlayerRepository playerRepo;
    private final GameRepository gameRepo;
    private final SlotRepository slotRepo;

    public SlotController(PlayerRepository playerRepo, GameRepository gameRepo, SlotRepository slotRepo) {
        this.playerRepo = playerRepo;
        this.gameRepo = gameRepo;
        this.slotRepo = slotRepo;
    }

    @PostMapping("/{playerId}/spin")
    public Map<String, Object> spin(@PathVariable Long playerId, @RequestParam int coins) {
        Player player = playerRepo.findById(playerId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found"));
        Game game = gameRepo.findByTitle("Slot").orElseThrow();
        return slotRepo.spin(player, game, coins);
    }
}
