package com.example.casinobackend.Games.Pferderennen;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.casinobackend.entities.Player;
import com.example.casinobackend.repositories.PlayerRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/horserace")
public class PferderennenController {

    private final PferderennenService pferderennenservice;
    private final PlayerRepository playerRepository;

    private final Pferdrepository pferdrepository;

    public PferderennenController(PlayerRepository playerRepository,
            PferderennenService pferderennenservice, Pferdrepository pferdrepository) {
        this.playerRepository = playerRepository;
        this.pferdrepository = pferdrepository;
        this.pferderennenservice = pferderennenservice;
    }

    @PostMapping("/{playerId}/startgame")
    public Map<String, Object> startGame(@PathVariable Long playerId, @RequestParam int horseId,
            @RequestParam int coins) {
        Player player = playerRepository.findById(playerId).orElseThrow();
        Pferd horse = pferdrepository.findById(horseId).orElseThrow();
        return pferderennenservice.startGame(player, coins, horse);
    }

    @PostMapping("/result")
    public Pferd reveal(@PathVariable Long id, @RequestParam int horseId,
            @RequestParam int coins) {
        Pferd horse = pferdrepository.findById(horseId).orElseThrow();
        Player player = playerRepository.findById(id).orElseThrow();
        return pferderennenservice.decideWinner(player, horse, coins);
    }

    @GetMapping("/horses")
    public List<Pferd> getAllHorses() {
        return pferderennenservice.getHorses();
    }
}
