package com.example.casinobackend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.casinobackend.entities.Avatar;
import com.example.casinobackend.entities.Player;

public interface AvatarRepository extends JpaRepository<Avatar, Long> {
Optional<Avatar> findByPlayer(Player player);
}
