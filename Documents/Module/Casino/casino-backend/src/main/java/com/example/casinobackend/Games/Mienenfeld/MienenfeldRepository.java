package com.example.casinobackend.Games.Mienenfeld;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.casinobackend.entities.Game;
import com.example.casinobackend.entities.Player;
import com.example.casinobackend.entities.Playingattempt;
import com.example.casinobackend.repositories.GameRepository;
import com.example.casinobackend.repositories.PlayingattemptRepository;

import jakarta.transaction.Transactional;

@Repository
public class MienenfeldRepository {

    @Autowired
    private final GameRepository gameRepository;

    private static class MineGameSession {

        List<Boolean> fieldMap;
        Set<Integer> revealed = new HashSet<>();
        int bombCount;
        int totalFields;
        int bet;
        int currentProfit;
        boolean active;

        MineGameSession(List<Boolean> fieldMap, int bombCount, int totalFields, int bet) {
            this.fieldMap = fieldMap;
            this.bombCount = bombCount;
            this.totalFields = totalFields;
            this.bet = bet;
            this.currentProfit = 0;
            this.active = true;
        }
    }

    private final Map<Long, MineGameSession> sessions = new HashMap<>();

    @Autowired
    private PlayingattemptRepository playingattemptRepository;

    MienenfeldRepository(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Transactional
    public Map<String, Object> startGame(Player player, Game game, int coins, int fields, int bombs) {
        if (player.getCoins() < coins) {
            throw new IllegalArgumentException("Nicht genügend Coins.");
        }
        if (bombs >= fields) {
            throw new IllegalArgumentException("Zu viele Bomben für die Anzahl Felder.");
        }

        List<Boolean> fieldMap = new ArrayList<>(Collections.nCopies(fields, false));
        Random random = new Random();
        int bombsPlaced = 0;
        while (bombsPlaced < bombs) {
            int index = random.nextInt(fields);
            if (!fieldMap.get(index)) {
                fieldMap.set(index, true);
                bombsPlaced++;
            }
        }

        player.setCoins(player.getCoins() - coins);
        MineGameSession session = new MineGameSession(fieldMap, bombs, fields, coins);
        sessions.put(player.getPlayerId(), session);

        return Map.of(
                "message", "Spiel gestartet",
                "fields", fields,
                "bombs", bombs,
                "bet", coins,
                "playerBalance", player.getCoins()
        );
    }

    public Map<String, Object> revealField(Player player, int index) {
        MineGameSession session = sessions.get(player.getPlayerId());
        if (session == null || !session.active) {
            throw new IllegalStateException("Kein aktives Spiel gefunden.");
        }
        if (index < 0 || index >= session.totalFields) {
            throw new IllegalArgumentException("Ungültiger Index.");
        }
        if (session.revealed.contains(index)) {
            throw new IllegalArgumentException("Feld bereits aufgedeckt.");
        }

        session.revealed.add(index);

        if (session.fieldMap.get(index)) {
            Game game = gameRepository.findByTitle("Minenfeld").orElseThrow();
            session.active = false;
            Playingattempt result = new Playingattempt();
            result.setDate(LocalDateTime.now());
            result.setGame(game);
            result.setPlayer(player);
            result.setSettedcoins(session.bet);
            result.setFinishingbalance(player.getCoins());
            playingattemptRepository.save(result);
            sessions.remove(player.getPlayerId());

            return Map.of(
                    "status", "LOSE",
                    "message", "Bombe getroffen!",
                    "revealed", session.revealed
            );
        } else {
            double multiplier = 1.0 + (0.65 * session.revealed.size()) * ((double) session.bombCount / session.totalFields);
            session.currentProfit = (int) Math.round(session.bet * multiplier);

            return Map.of(
                    "status", "IN_PROGRESS",
                    "revealed", session.revealed,
                    "currentProfit", session.currentProfit
            );
        }
    }

    public Map<String, Object> cashout(Player player, Game game) {
        MineGameSession session = sessions.get(player.getPlayerId());
        if (session == null || !session.active) {
            throw new IllegalStateException("Kein aktives Spiel.");
        }

        session.active = false;
        sessions.remove(player.getPlayerId());

        player.setCoins(player.getCoins() + session.currentProfit);

        Playingattempt result = new Playingattempt();
        result.setDate(LocalDateTime.now());
        result.setGame(game);
        result.setPlayer(player);
        result.setSettedcoins(session.bet);
        result.setFinishingbalance(player.getCoins());
        playingattemptRepository.save(result);

        return Map.of(
                "status", "CASHED_OUT",
                "profit", session.currentProfit,
                "finalBalance", player.getCoins(),
                "revealed", session.revealed
        );
    }
}
