package com.example.casinobackend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.casinobackend.entities.Game;

public interface GameRepository extends JpaRepository<Game, Long> {
Optional<Game> findByTitle(String title);
}
