package com.example.casinobackend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.casinobackend.entities.Player;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    Optional<Player> findByUsername(String username);

    boolean existsByUsername(String username);

    Optional<Player> findPlayerByToken(String token);

    Optional<Player> findPlayerByBadgenumber(String badgenumber);

    boolean existsByEmail(String email);

    Optional<Player> findByEmail(String email);
}
