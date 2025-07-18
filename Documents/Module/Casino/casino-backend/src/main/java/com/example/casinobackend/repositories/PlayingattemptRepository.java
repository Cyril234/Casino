package com.example.casinobackend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.casinobackend.entities.Player;
import com.example.casinobackend.entities.Playingattempt;

public interface PlayingattemptRepository extends JpaRepository<Playingattempt, Long> {
    List<Playingattempt> findByPlayer(Optional<Player> player);
}
