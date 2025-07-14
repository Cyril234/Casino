package com.example.casinobackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.casinobackend.entities.Avatar;

public interface AvatarRepository extends JpaRepository<Avatar, Long> {
}
