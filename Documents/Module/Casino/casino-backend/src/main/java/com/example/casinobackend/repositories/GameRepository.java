package com.example.casinobackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.casinobackend.entities.Game;

public interface GameRepository extends JpaRepository<Game, Long> {

}
