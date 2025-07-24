package com.example.casinobackend.Games.BlackJack;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.casinobackend.entities.Game;
import com.example.casinobackend.entities.Player;
import com.example.casinobackend.entities.Playingattempt;
import com.example.casinobackend.repositories.GameRepository;
import com.example.casinobackend.repositories.PlayingattemptRepository;

import jakarta.transaction.Transactional;

@Repository
public class BlackJackRepository {

    private final Map<Long, List<String>> playerHands = new HashMap<>();
    private final Map<Long, List<String>> dealerHands = new HashMap<>();
    private final Map<Long, Deck> decks = new HashMap<>();
    private final Map<Long, Integer> playerBets = new HashMap<>();

    @Autowired
    private GameRepository gameRepo;
    @Autowired
    private PlayingattemptRepository playingattemptRepo;

    @Transactional
    public Map<String, Object> startGame(Player player, Game game, int betCoins) {
        if (player.getCoins() < betCoins) {
            throw new IllegalArgumentException("Nicht genügend Coins");
        } else if (betCoins <= 0) {
            throw new IllegalArgumentException("Der Einsatz muss größer als 0 sein");
        }

        Deck deck = new Deck();
        List<String> playerHand = new ArrayList<>();
        List<String> dealerHand = new ArrayList<>();

        playerHand.add(deck.drawCard());

        dealerHand.add("?");
        dealerHand.add(deck.drawCard());

        playerHands.put(player.getPlayerId(), playerHand);
        dealerHands.put(player.getPlayerId(), dealerHand);
        decks.put(player.getPlayerId(), deck);

        player.setCoins(player.getCoins() - betCoins);
        playerBets.put(player.getPlayerId(), betCoins);

        return Map.of(
                "playerHand", playerHand,
                "dealerHand", dealerHand
        );
    }

    public Map<String, Object> hit(Player player) {
        Long playerId = player.getPlayerId();
        List<String> playerHand = playerHands.get(playerId);
        Deck deck = decks.get(playerId);

        if (playerHand == null || deck == null) {
            throw new IllegalArgumentException("Das Spiel ist nicht mehr aktiv.");
        }

        playerHand.add(deck.drawCard());

        int score = calculateScore(playerHand);
        String status = "IN_PROGRESS";

        if (score > 21) {
            status = "BUST";
        } else if (score == 21) {
            status = "BLACKJACK";
        }

        return Map.of(
                "playerHand", playerHand,
                "status", status
        );
    }

    @Transactional
    public Map<String, Object> stand(Player player) {
        Long id = player.getPlayerId();
        List<String> dealerHand = dealerHands.get(id);
        List<String> playerHand = playerHands.get(id);
        Deck deck = decks.get(id);

        if (deck == null || playerHand == null || dealerHand == null) {
            throw new IllegalArgumentException("Kein aktives Spiel vorhanden. Bitte zuerst starten.");
        }

        dealerHand.set(0, deck.drawCard());

        while (calculateScore(dealerHand) < 17) {
            dealerHand.add(deck.drawCard());
        }

        int playerScore = calculateScore(playerHand);
        int dealerScore = calculateScore(dealerHand);

        int outcome;
        String result;

        if ((dealerScore > 21 && playerScore <= 21) || (playerScore > dealerScore && playerScore <= 21)) {
            outcome = 2;
            result = "PLAYER_WINS";
        } else if (dealerScore == playerScore) {
            outcome = 1;
            result = "DRAW";
        } else if (playerScore == 21 && playerHand.size() == 2) {
            outcome = 3;
            result = "PLAYER_WINS";
        } else {
            outcome = 0;
            result = "DEALER_WINS";
        }
        int bet = playerBets.getOrDefault(player.getPlayerId(), 0);
        int coinsWon = bet * outcome;

        player.setCoins(player.getCoins() + coinsWon);

        Game blackjackGame = gameRepo.findByTitle("Blackjack")
                .orElseThrow(() -> new IllegalArgumentException("Spiel 'Blackjack' nicht gefunden"));

        Playingattempt resultAttempt = new Playingattempt();
        resultAttempt.setDate(LocalDateTime.now());
        resultAttempt.setGame(blackjackGame);
        resultAttempt.setPlayer(player);
        resultAttempt.setSettedcoins(bet);
        resultAttempt.setFinishingbalance(player.getCoins());

        playingattemptRepo.save(resultAttempt);

        playerHands.remove(id);
        dealerHands.remove(id);
        decks.remove(id);
        playerBets.remove(id);

        return Map.of(
                "playerHand", playerHand,
                "dealerHand", dealerHand,
                "result", result,
                "coinsWon", coinsWon,
                "balance", player.getCoins()
        );
    }

    @Transactional
    public Map<String, Object> doubleDown(Player player) {
        Long playerId = player.getPlayerId();

        List<String> playerHand = playerHands.get(playerId);
        List<String> dealerHand = dealerHands.get(playerId);
        Deck deck = decks.get(playerId);

        if (playerHand == null || dealerHand == null || deck == null) {
            throw new IllegalArgumentException("Kein aktives Spiel vorhanden. Bitte zuerst starten.");
        }

        int currentBet = playerBets.getOrDefault(playerId, 0);

        if (player.getCoins() < currentBet) {
            throw new IllegalArgumentException("Nicht genügend Coins zum Verdoppeln.");
        }

        player.setCoins(player.getCoins() - currentBet);
        playerBets.clear();
        playerBets.put(playerId, currentBet * 2);

        playerHand.add(deck.drawCard());

        return stand(player);
    }

    private int calculateScore(List<String> hand) {
        int score = 0;
        int aces = 0;

        for (String card : hand) {
            if (card.equals("?")) {
                continue;
            }
            String value = card.substring(0, card.length() - 1);
            switch (value) {
                case "A" -> {
                    score += 11;
                    aces++;
                }
                case "K", "Q", "J" ->
                    score += 10;
                default ->
                    score += Integer.parseInt(value);
            }
        }

        while (score > 21 && aces-- > 0) {
            score -= 10;
        }

        return score;
    }
}
