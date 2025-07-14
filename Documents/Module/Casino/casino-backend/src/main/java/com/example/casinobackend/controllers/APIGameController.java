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

import com.example.casinobackend.entities.Game;
import com.example.casinobackend.repositories.GameRepository;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "http://localhost:5173")
public class APIGameController {
    @Autowired
    GameRepository gameRepository;

    @GetMapping
    public ResponseEntity<List<Game>> getGames() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body((List<Game>) gameRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Game> getGame(@PathVariable Long id) {
        Optional<Game> game = gameRepository.findById(id);
        return game.map(value -> ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(value)).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Game> deleteGame(@PathVariable long id) {
        if (gameRepository.findById(id).isPresent()) {
            gameRepository.deleteById(id);
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
    ResponseEntity<Iterable<Game>> deleteAllGames() {
        gameRepository.deleteAll();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(gameRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Game> createGame(@RequestBody Game game) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .contentType(MediaType.APPLICATION_JSON)
                .body(gameRepository.save(game));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Game> updateGame(@PathVariable long id, @RequestBody Game newGame) {
        Optional<Game> currentGame = gameRepository.findById(id);

        return currentGame
                .map(game -> {
                    game.setTitle(newGame.getTitle());
                    return ResponseEntity
                            .status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(gameRepository.save(game));
                }).orElseGet(() -> {
                    return ResponseEntity
                            .status(HttpStatus.CREATED)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(gameRepository.save(newGame));
                });
    }
}
