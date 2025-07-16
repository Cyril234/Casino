package com.example.casinobackend.controllers;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.casinobackend.dataTransferObject.LoginPasswordRequest;
import com.example.casinobackend.dataTransferObject.LogoutRequest;
import com.example.casinobackend.dataTransferObject.TokenResponse;
import com.example.casinobackend.entities.Player;
import com.example.casinobackend.repositories.PlayerRepository;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;

@RestController

@CrossOrigin(origins = "http://localhost:5173")
public class APILoginController {

    @Autowired
    PlayerRepository playerRepository;

    private String UID = "";

    @PostMapping("api/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginPasswordRequest request) {
        Argon2 argon2 = Argon2Factory.create();
        String token;

        Optional<Player> player = playerRepository.findByUsername(request.getUsername());

        System.out.println(player);

        if (player.isPresent() && argon2.verify(player.get().getPassword(), request.getPassword().toCharArray())) {
            token = generateToken();
            Player existing = player.get();
            existing.setToken(token);
            existing.setLogins(existing.getLogins() + 1);
            playerRepository.save(existing);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new TokenResponse(token));

        } else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new TokenResponse(""));
        }
    }

    @PostMapping("api/loginUID")
    public ResponseEntity<TokenResponse> login() {
        Argon2 argon2 = Argon2Factory.create();
        String token;

        System.out.println("ligin" + UID);

        if (UID != "") {

            Optional<Player> player = playerRepository.findPlayerByToken(argon2.hash(2, 65536, 1, UID.toCharArray()));

            if (player.isPresent()) {
                token = generateToken();
                Player existing = player.get();
                existing.setToken(token);
                existing.setLogins(existing.getLogins() + 1);
                playerRepository.save(existing);

                return ResponseEntity
                        .status(HttpStatus.CREATED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(new TokenResponse(token));
            } else {
                token = generateToken();
                Player newPlayer = new Player();
                newPlayer.setToken(token);
                newPlayer.setLogins(1);
                playerRepository.save(newPlayer);

                return ResponseEntity
                        .status(HttpStatus.CREATED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(new TokenResponse(token));
            }

        } else {
            return ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new TokenResponse(""));
        }
    }

    @PostMapping("api/loginAsGuest")
    public ResponseEntity<TokenResponse> loginGast() {
        String token;

        Optional<Player> gastOptional = playerRepository.findByUsername("gast");
        Player gast = gastOptional.get();
        token = generateToken();
        gast.setToken(token);
        gast.setLogins(gast.getLogins() + 1);
        gast.setCoins(10000);
        playerRepository.save(gast);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .contentType(MediaType.APPLICATION_JSON)
                .body(new TokenResponse(token));
    }

    @PostMapping("/api/logout")
    public ResponseEntity<String> logout(@RequestBody LogoutRequest logoutRequest) {
        try {
            // Just find by the token directly; do not hash!
            Optional<Player> player = playerRepository.findPlayerByToken(logoutRequest.getToken());
            if (player.isPresent()) {
                Player player2 = player.get();
                player2.setToken("");
                playerRepository.save(player2);

                return ResponseEntity.ok("Logout erfolgreich");
            } else {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Kein gültiger Token angegeben");
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Fehler beim Logout");
        }
    }

    public static String generateToken() {
        byte[] randomBytes = new byte[32];
        new SecureRandom().nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    public String getUID() {
        return UID;
    }

    public void setUID(String uID) {
        UID = uID;
        System.out.println(UID);
    }
}
