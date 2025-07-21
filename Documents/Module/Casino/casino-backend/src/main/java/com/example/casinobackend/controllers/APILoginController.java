package com.example.casinobackend.controllers;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
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
    public ResponseEntity<?> login(@RequestBody LoginPasswordRequest request) {
        Argon2 argon2 = Argon2Factory.create();

        Optional<Player> playerOpt = playerRepository.findByUsername(request.getUsername());

        if (playerOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Benutzername oder Passwort ist ungültig.");
        }

        Player player = playerOpt.get();

        if (!argon2.verify(player.getPassword(), request.getPassword().toCharArray())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Benutzername oder Passwort ist ungültig.");
        }

        String token = generateToken();
        player.setToken(token);
        player.setLogins(player.getLogins() + 1);

        if (player.getLastlogindate() != null && !player.getLastlogindate().isEqual(LocalDate.now())) {
            player.setCoins(player.getCoins() + 500);
        }
        player.setLastlogindate(LocalDate.now());
        playerRepository.save(player);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new TokenResponse(token));
    }

    @PostMapping("api/loginUID")
    public ResponseEntity<TokenResponse> loginUID(@RequestBody Map<String, String> body) {

        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            byte[] hashBytes = md.digest(body.get("uid").getBytes());
            String token;
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            String UID = sb.toString();

            System.out.println("ligin" + UID);

            if (UID != "") {

                System.out.println("test:" + UID);

                Optional<Player> player = playerRepository.findPlayerByBadgenumber(UID);

                if (player.isPresent()) {
                    token = generateToken();
                    Player existing = player.get();
                    existing.setToken(token);
                    existing.setLogins(existing.getLogins() + 1);
                    if (existing.getLastlogindate() != null) {
                        if (!existing.getLastlogindate().isEqual(LocalDate.now())) {
                            existing.setCoins(existing.getCoins() + 500);
                        }
                    }
                    existing.setLastlogindate(LocalDate.now());
                    playerRepository.save(existing);

                    return ResponseEntity
                            .status(HttpStatus.CREATED)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(new TokenResponse(token));
                } else {
                    token = generateToken();
                    Player newPlayer = new Player();
                    newPlayer.setToken(token);
                    newPlayer.setUsername(
                            "supergeheim!ZurSicherheit_1234_geheim_sodass_niemand_unberechtigtes_auf_diese_Seite_zugreiffen_kann_1267");
                    newPlayer.setLogins(1);
                    newPlayer.setBadgenumber(UID);

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
        } catch (Error e) {
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
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
