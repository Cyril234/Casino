package com.example.casinobackend.controllers;

import java.security.SecureRandom;
import java.util.Base64;
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

import com.example.casinobackend.entities.Avatar;
import com.example.casinobackend.entities.Player;
import com.example.casinobackend.repositories.AvatarRepository;
import com.example.casinobackend.repositories.PlayerRepository;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = "http://localhost:5173")
public class APIPlayerController {
    @Autowired
    PlayerRepository playerRepository;

    @Autowired
    AvatarRepository avatarRepository;

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
    @Transactional
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        Optional<Player> optionalPlayer = playerRepository.findById(id);
        if (optionalPlayer.isPresent()) {
            Player player = optionalPlayer.get();

            Avatar avatar = player.getAvatar();
            if (avatar != null) {
                avatar.setPlayer(null);
                avatarRepository.save(avatar);
            }

            player.setAvatar(null);
            playerRepository.delete(player);

            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<Void> deleteAllPlayers() {

        Iterable<Player> players = playerRepository.findAll();

        for (Player player : players) {
            Avatar avatar = player.getAvatar();
            if (avatar != null) {
                avatar.setPlayer(null);
                avatarRepository.save(avatar);
            }
            player.setAvatar(null);
        }

        playerRepository.deleteAll();

        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<Player> createPlayer(@RequestBody Player player) {
        Argon2 argon2 = Argon2Factory.create();

        char[] pw = player.getPassword().toCharArray();
        player.setPassword(argon2.hash(2, 65536, 1, pw));
        argon2.wipeArray(pw);
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
