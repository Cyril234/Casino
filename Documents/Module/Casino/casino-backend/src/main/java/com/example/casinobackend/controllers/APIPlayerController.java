package com.example.casinobackend.controllers;

import java.security.MessageDigest;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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
import org.springframework.web.bind.annotation.RequestMethod;

import com.example.casinobackend.entities.Avatar;
import com.example.casinobackend.entities.Player;
import com.example.casinobackend.repositories.AvatarRepository;
import com.example.casinobackend.repositories.PlayerRepository;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import jakarta.transaction.Transactional;

@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = { RequestMethod.GET,
        RequestMethod.DELETE,
        RequestMethod.PUT,
        RequestMethod.POST,
        RequestMethod.OPTIONS })
@RestController
@RequestMapping("/api/players")
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

    @GetMapping("/byToken/{token}")
    public ResponseEntity<Player> getPlayerByToken(@PathVariable String token) {
        return playerRepository.findPlayerByToken(token)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .build());
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
    public ResponseEntity<?> createPlayer(@RequestBody Player player) {
        Argon2 argon2 = Argon2Factory.create();
        char[] pw = player.getPassword().toCharArray();
        player.setPassword(argon2.hash(2, 65536, 1, pw));
        argon2.wipeArray(pw);

        if (playerRepository.existsByUsername(player.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Dieser Benutzername ist bereits vergeben.");
        }

        if (player.getEmail() != null && playerRepository.existsByEmail(player.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Diese E-Mail-Adresse ist bereits registriert.");
        }

        try {
            Player saved = playerRepository.save(player);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Registrierung fehlgeschlagen. Bitte überprüfe deine Angaben.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlayer(@PathVariable long id, @RequestBody Player newPlayer) {
        Optional<Player> currentPlayer = playerRepository.findById(id);
        if (currentPlayer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Spieler nicht gefunden.");
        }

        Player player = currentPlayer.get();

        if (newPlayer.getUsername() != null && !newPlayer.getUsername().isEmpty()) {
            Optional<Player> existingWithUsername = playerRepository.findByUsername(newPlayer.getUsername());
            if (existingWithUsername.isPresent() && existingWithUsername.get().getPlayerId() != id) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Dieser Benutzername ist bereits vergeben.");
            }
            player.setUsername(newPlayer.getUsername());
        }

        if (newPlayer.getEmail() != null && !newPlayer.getEmail().isEmpty()) {
            Optional<Player> existingWithEmail = playerRepository.findByEmail(newPlayer.getEmail());
            if (existingWithEmail.isPresent() && existingWithEmail.get().getPlayerId() != id) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Diese E-Mail ist bereits vergeben.");
            }
            player.setEmail(newPlayer.getEmail());
        }

        if (newPlayer.getPassword() != null && !newPlayer.getPassword().isEmpty()) {
            Argon2 argon2 = Argon2Factory.create();
            char[] pw = newPlayer.getPassword().toCharArray();
            String hashed = argon2.hash(2, 65536, 1, pw);
            argon2.wipeArray(pw);
            player.setPassword(hashed);
        }

        player.setCoins(newPlayer.getCoins());
        player.setVolume(newPlayer.getVolume());

        if (newPlayer.getColortheme() != null) {
            player.setColortheme(newPlayer.getColortheme());
        }

        if (newPlayer.getSoundstatus() != null) {
            player.setSoundstatus(newPlayer.getSoundstatus());
        }

        if (newPlayer.getBadgenumber() != null) {
            player.setBadgenumber(newPlayer.getBadgenumber());
        } else {
            player.setBadgenumber(null);
        }

        player.setLogins(newPlayer.getLogins());

        if (newPlayer.getLastlogindate() != null) {
            player.setLastlogindate(newPlayer.getLastlogindate());
        }

        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(playerRepository.save(player));
    }

    @PutMapping("/settings/{id}")
    public ResponseEntity<Player> updateSoundAndVolume(@PathVariable long id,
            @RequestBody Player newPlayer) {
        Optional<Player> currentPlayer = playerRepository.findById(id);

        return currentPlayer
                .map(player -> {
                    player.setVolume(newPlayer.getVolume());
                    player.setSoundstatus(newPlayer.getSoundstatus());
                    return ResponseEntity
                            .status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(playerRepository.save(player));
                }).orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .build());
    }

}
