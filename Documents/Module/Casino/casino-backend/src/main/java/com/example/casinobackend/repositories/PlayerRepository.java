package com.example.casinobackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.casinobackend.entities.Player;

public interface PlayerRepository extends JpaRepository<Player, Long> {

}
