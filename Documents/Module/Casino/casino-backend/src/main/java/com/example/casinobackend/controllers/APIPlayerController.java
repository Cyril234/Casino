package com.example.casinobackend.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.casinobackend.entities.Player;
import com.example.casinobackend.repositories.PlayerRepository;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = "http://localhost:5173")
public class APIPlayerController {
    @Autowired
    PlayerRepository playerRepository;

    @GetMapping
    public ResponseEntity<List<Player>> getPlayers() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body((List<Player>) playerRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayer(@PathVariable Long id) {
        Optional<Player> player = playerRepository.findById(id);
        return player.map(value -> ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(value)).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Player> deletePlayer(@PathVariable long id) {
        if (playerRepository.findById(id).isPresent()) {
            playerRepository.deleteById(id);
            return ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .build();
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
    }

    @DeleteMapping
    ResponseEntity<Iterable<Player>> deleteAllPlayers() {
        playerRepository.deleteAll();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(playerRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Player> createPlayer(@RequestBody Player player) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .contentType(MediaType.APPLICATION_JSON)
                .body(playerRepository.save(player));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(@PathVariable long id,
            @RequestBody Player newPlayer) {
        Optional<Player> currentPlayer = playerRepository.findById(id);

        return currentPlayer
                .map(player -> {
                    player.setUsername(newPlayer.getUsername());
                    player.setEmail(newPlayer.getEmail());
                    player.setPassword(newPlayer.getPassword());
                    player.setCoins(newPlayer.getCoins());
                    player.setColortheme(newPlayer.getColortheme());
                    player.setVolume(newPlayer.getVolume());
                    player.setSoundstatus(newPlayer.getSoundstatus());
                    player.setBadgenumber(newPlayer.getBadgenumber());
                    player.setLogins(newPlayer.getLogins());
                    return ResponseEntity
                            .status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(playerRepository.save(player));
                }).orElseGet(() -> {
                    return ResponseEntity
                            .status(HttpStatus.CREATED)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(playerRepository.save(newPlayer));
                });
    }
}
