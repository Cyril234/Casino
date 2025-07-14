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

    @PostMapping("api/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginPasswordRequest request) {
        Argon2 argon2 = Argon2Factory.create();
        String token;

        Optional<Player> player = playerRepository.findByUsername(request.getUsername());
        
        System.out.println(player);

        if (player.isPresent() && argon2.verify(player.get().getPassword(), request.getPassword().toCharArray())){
            token = generateToken();
            Player existing = player.get();
            existing.setToken(token);
            playerRepository.save(existing);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new TokenResponse(token));

        }else{
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new TokenResponse(""));
        }
    }

    public static String generateToken() {
        byte[] randomBytes = new byte[32];
        new SecureRandom().nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
}
