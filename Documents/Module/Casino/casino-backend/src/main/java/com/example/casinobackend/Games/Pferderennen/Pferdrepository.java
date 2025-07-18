package com.example.casinobackend.Games.Pferderennen;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface Pferdrepository extends JpaRepository<Pferd, Long> {
    Optional<Pferd> findById(int id);
}
