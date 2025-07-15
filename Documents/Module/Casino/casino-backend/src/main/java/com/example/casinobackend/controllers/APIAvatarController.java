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

import com.example.casinobackend.entities.Avatar;
import com.example.casinobackend.entities.Player;
import com.example.casinobackend.repositories.AvatarRepository;
import com.example.casinobackend.repositories.PlayerRepository;

import jakarta.transaction.Transactional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/avatars")
public class APIAvatarController {

    @Autowired
    AvatarRepository avatarRepository;

    @Autowired
    PlayerRepository playerRepository;

    @GetMapping
    public ResponseEntity<List<Avatar>> getAvatars() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body((List<Avatar>) avatarRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Avatar> getAvatar(@PathVariable Long id) {
        Optional<Avatar> avatar = avatarRepository.findById(id);
        return avatar.map(value -> ResponseEntity
                .status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(value)).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteAvatar(@PathVariable long id) {
        Optional<Avatar> optionalAvatar = avatarRepository.findById(id);
        if (optionalAvatar.isPresent()) {
            Avatar avatar = optionalAvatar.get();

            Player player = avatar.getPlayer();
            if (player != null) {
                player.setAvatar(null);
                avatar.setPlayer(null);
                playerRepository.save(player);
            }

            avatarRepository.delete(avatar);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<Void> deleteAllAvatars() {
        Iterable<Avatar> avatars = avatarRepository.findAll();

        for (Avatar avatar : avatars) {
            Player player = avatar.getPlayer();
            if (player != null) {
                player.setAvatar(null);
                avatar.setPlayer(null);
                playerRepository.save(player);
            }
        }

        avatarRepository.deleteAll();
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<Avatar> createAvatar(@RequestBody Avatar avatar) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .contentType(MediaType.APPLICATION_JSON)
                .body(avatarRepository.save(avatar));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Avatar> updateAvatar(@PathVariable long id, @RequestBody Avatar newAvatar) {
        Optional<Avatar> currentAvatar = avatarRepository.findById(id);

        return currentAvatar
                .map(avatar -> {
                    avatar.setName(newAvatar.getName());
                    avatar.setDescription(newAvatar.getDescription());
                    avatar.setHaircolor(newAvatar.getHaircolor());
                    avatar.setSkincolor(newAvatar.getSkincolor());
                    avatar.setBeard(newAvatar.getBeard());
                    avatar.setEyecolor(newAvatar.getEyecolor());
                    avatar.setHeadgear(newAvatar.getHeadgear());
                    avatar.setShirt(newAvatar.getShirt());
                    avatar.setTrouserstype(newAvatar.getTrouserstype());
                    avatar.setTrouserscolor(newAvatar.getTrouserscolor());
                    avatar.setShoes(newAvatar.getShoes());
                    avatar.setPlayer(newAvatar.getPlayer());
                    return ResponseEntity
                            .status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(avatarRepository.save(avatar));
                }).orElseGet(() -> {
                    return ResponseEntity
                            .status(HttpStatus.CREATED)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(avatarRepository.save(newAvatar));
                });
    }

}
