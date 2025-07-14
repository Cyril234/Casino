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
import com.example.casinobackend.repositories.AvatarRepository;

@RestController
@RequestMapping("/api/avatars")
@CrossOrigin(origins = "http://localhost:5173")
public class APIAvatarController {

    @Autowired
    AvatarRepository avatarRepository;

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
    ResponseEntity<Avatar> deleteAvatar(@PathVariable long id) {
        if (avatarRepository.findById(id).isPresent()) {
            avatarRepository.deleteById(id);
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
    ResponseEntity<Iterable<Avatar>> deleteAllvatars() {
        avatarRepository.deleteAll();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(avatarRepository.findAll());
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
                    avatar.setTrousers(newAvatar.getTrousers());
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
