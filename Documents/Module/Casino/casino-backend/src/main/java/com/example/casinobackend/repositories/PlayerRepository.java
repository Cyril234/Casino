package com.example.casinobackend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.casinobackend.entities.Player;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    Optional<Player> findByUsername(String username);
    Optional<Player> findPlayerByToken(String token);
    Optional<Player> findPlayerByBadgenumber(String badgenumber);
}
