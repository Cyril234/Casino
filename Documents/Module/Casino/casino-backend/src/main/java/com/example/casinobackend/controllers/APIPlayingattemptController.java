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

import com.example.casinobackend.entities.Playingattempt;
import com.example.casinobackend.repositories.PlayingattemptRepository;

@RestController
@RequestMapping("/api/playingattempts")
@CrossOrigin(origins = "http://localhost:5173")
public class APIPlayingattemptController {

    @Autowired
    PlayingattemptRepository playingattemptRepository;

    @GetMapping
    public ResponseEntity<List<Playingattempt>> getPlayingattempts() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body((List<Playingattempt>) playingattemptRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Playingattempt> getPlayingattempt(@PathVariable Long id) {
        Optional<Playingattempt> playingattempt = playingattemptRepository.findById(id);
        return playingattempt.map(value -> ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(value)).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Playingattempt> deletePlayingattempt(@PathVariable long id) {
        if (playingattemptRepository.findById(id).isPresent()) {
            playingattemptRepository.deleteById(id);
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
    ResponseEntity<Iterable<Playingattempt>> deleteAllPlayingattempts() {
        playingattemptRepository.deleteAll();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(playingattemptRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Playingattempt> createPlayingattempt(@RequestBody Playingattempt playingattempt) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .contentType(MediaType.APPLICATION_JSON)
                .body(playingattemptRepository.save(playingattempt));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Playingattempt> updatePlayingattempt(@PathVariable long id,
            @RequestBody Playingattempt newPlayingattempt) {
        Optional<Playingattempt> currentPlayingattempt = playingattemptRepository.findById(id);

        return currentPlayingattempt
                .map(playingatempt -> {
                    playingatempt.setDate(newPlayingattempt.getDate());
                    playingatempt.setSettedcoins(newPlayingattempt.getSettedcoins());
                    playingatempt.setFinishingbalance(newPlayingattempt.getFinishingbalance());
                    playingatempt.setPlayer(newPlayingattempt.getPlayer());
                    playingatempt.setGame(newPlayingattempt.getGame());
                    return ResponseEntity
                            .status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(playingattemptRepository.save(playingatempt));
                }).orElseGet(() -> {
                    return ResponseEntity
                            .status(HttpStatus.CREATED)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(playingattemptRepository.save(newPlayingattempt));
                });
    }
}
