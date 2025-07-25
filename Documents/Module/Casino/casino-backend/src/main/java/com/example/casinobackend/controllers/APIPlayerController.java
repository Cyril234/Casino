package com.example.casinobackend.controllers;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Map;
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
import com.example.casinobackend.enums.Soundstatus;
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

    @PutMapping("/badge/{id}")
    public ResponseEntity<?> addBadge(@PathVariable long id, @RequestBody Player newPlayer) {
        Optional<Player> currentPlayer = playerRepository.findById(id);
        if (currentPlayer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Spieler nicht gefunden.");
        }

        Player player = currentPlayer.get();

        String rawBadge = newPlayer.getBadgenumber();

        if (rawBadge != null) {
            try {
                MessageDigest md = MessageDigest.getInstance("SHA-512");
                byte[] hashBytes = md.digest(rawBadge.getBytes());
                StringBuilder sb = new StringBuilder();
                for (byte b : hashBytes) {
                    sb.append(String.format("%02x", b));
                }
                String hashedBadgenumber = sb.toString();

                Optional<Player> existing = playerRepository.findPlayerByBadgenumber(hashedBadgenumber);
                if (existing.isPresent() && existing.get().getPlayerId() != id) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("Diese Badgenummer ist bereits registriert.");
                }

                player.setBadgenumber(hashedBadgenumber);
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Hashing fehlgeschlagen.");
            }
        } else {
            player.setBadgenumber(null);
        }

        Player savedPlayer = playerRepository.save(player);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(savedPlayer);
    }

    @PutMapping("/settings/{id}")
    public ResponseEntity<?> updateSettings(@PathVariable Long id, @RequestBody Map<String, Object> settings) {
        Optional<Player> optionalPlayer = playerRepository.findById(id);
        if (optionalPlayer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Spieler nicht gefunden.");
        }

        Player player = optionalPlayer.get();

        try {
            if (settings.containsKey("soundstatus")) {
                Object rawValue = settings.get("soundstatus");
                try {
                    Soundstatus status = Soundstatus.valueOf(rawValue.toString().toUpperCase());
                    player.setSoundstatus(status);
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Ungültiger Wert für soundstatus. Erlaubt: ON oder OFF.");
                }
            }

            if (settings.containsKey("volume")) {
                Object volumeValue = settings.get("volume");
                if (volumeValue instanceof Number) {
                    player.setVolume(((Number) volumeValue).intValue());
                } else {
                    return ResponseEntity.badRequest().body("Ungültiger Wert für volume.");
                }
            }

            playerRepository.save(player);
            return ResponseEntity.ok("Einstellungen erfolgreich gespeichert.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler beim Verarbeiten der Einstellungen: " + e.getMessage());
        }
    }

}
