package com.example.casinobackend.Games.Roulette;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.casinobackend.Games.Roulette.RouletteRepository.BetRequest;
import com.example.casinobackend.entities.Game;
import com.example.casinobackend.entities.Player;
import com.example.casinobackend.repositories.GameRepository;
import com.example.casinobackend.repositories.PlayerRepository;

@RestController
@RequestMapping("/roulette")
@CrossOrigin(origins = "http://localhost:5173")
public class RouletteController {

    private final PlayerRepository playerRepo;
    private final GameRepository gameRepo;
    private final RouletteRepository rouletteRepo;

    public RouletteController(PlayerRepository playerRepo, GameRepository gameRepo, RouletteRepository rouletteRepo) {
        this.playerRepo = playerRepo;
        this.gameRepo = gameRepo;
        this.rouletteRepo = rouletteRepo;
    }

    @PostMapping("/{playerId}/spin-multi")
    public Map<String, Object> spinMulti(
            @PathVariable Long playerId,
            @RequestBody List<BetRequest> bets) {

        Player player = playerRepo.findById(playerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found"));
        Game game = gameRepo.findByTitle("Roulette")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found"));

        return rouletteRepo.spinMulti(player, game, bets);
    }
}
