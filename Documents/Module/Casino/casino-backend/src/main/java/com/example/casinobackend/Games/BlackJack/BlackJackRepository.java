package com.example.casinobackend.Games.BlackJack;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.casinobackend.entities.Game;
import com.example.casinobackend.entities.Player;        
import com.example.casinobackend.entities.Playingattempt;

import jakarta.transaction.Transactional;

@Repository
public class BlackJackRepository {

    private final Map<Long, List<String>> playerHands = new HashMap<>();
    private final Map<Long, List<String>> dealerHands = new HashMap<>();
    private final Map<Long, Deck> decks = new HashMap<>();

    @Transactional
    public Map<String, Object> startGame(Player player, Game game, int betCoins) {
        if (player.getCoins() < betCoins) {
            throw new IllegalArgumentException("Nicht genügend Coins");
        }

        Deck deck = new Deck();
        List<String> playerHand = new ArrayList<>();
        List<String> dealerHand = new ArrayList<>();

        playerHand.add(deck.drawCard());
        playerHand.add(deck.drawCard());

        dealerHand.add("?");
        dealerHand.add(deck.drawCard());

        playerHands.put(player.getPlayerId(), playerHand);
        dealerHands.put(player.getPlayerId(), dealerHand);
        decks.put(player.getPlayerId(), deck);

        player.setCoins(player.getCoins() - betCoins);

        Playingattempt attempt = new Playingattempt();
        attempt.setDate(LocalDateTime.now());
        attempt.setGame(game);
        attempt.setPlayer(player);
        attempt.setSettedcoins(betCoins);
        attempt.setFinishingbalance(player.getCoins());

        return Map.of(
            "attempt", attempt,
            "playerHand", playerHand,           
            "dealerHand", dealerHand
        );
    }

    public Map<String, Object> hit(Player player) {
        List<String> playerHand = playerHands.get(player.getPlayerId());
        Deck deck = decks.get(player.getPlayerId());

        playerHand.add(deck.drawCard());

        int score = calculateScore(playerHand);
        String status = "IN_PROGRESS";

        if (score > 21) {
            status = "BUST";
            stand(player);
        } else if (score == 21) {
            status = "BLACKJACK";
            stand(player);
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

        dealerHand.set(0, deck.drawCard());

        while (calculateScore(dealerHand) < 17) {
            dealerHand.add(deck.drawCard());
        }

        int playerScore = calculateScore(playerHand);
        int dealerScore = calculateScore(dealerHand);

        int outcome = 0;
        String result;

        if (dealerScore > 21 && playerScore < 21 || playerScore > dealerScore && playerScore <= 21) {
            outcome = 2;
            result = "PLAYER_WINS";
        } else if (dealerScore == playerScore) {
            outcome = 1;
            result = "DRAW";
        } else {
            outcome = 0;
            result = "DEALER_WINS";
        }

        int originalBet = 0;
        for (Playingattempt pa : player.getPlayingattempts()) {
            if (pa.getGame().getTitle().equalsIgnoreCase("Blackjack") && pa.getFinishingbalance() == player.getCoins()) {
                originalBet = pa.getSettedcoins();
                break;
            }
        }

        int coinsWon = originalBet * outcome;
        player.setCoins(player.getCoins() + coinsWon);

        Playingattempt resultAttempt = new Playingattempt();
        resultAttempt.setDate(LocalDateTime.now());
        resultAttempt.setGame(new Game() {{ setGameId(1L); setTitle("Blackjack"); }});
        resultAttempt.setPlayer(player);
        resultAttempt.setSettedcoins(originalBet);
        resultAttempt.setFinishingbalance(player.getCoins());

        playerHands.remove(id);
        dealerHands.remove(id);
        decks.remove(id);

         return Map.of(
            "resultAttempt", resultAttempt,
            "playerHand", playerHand,
            "dealerHand", dealerHand,
            "result", result
        );
    }

    private int calculateScore(List<String> hand) {
        int score = 0;
        int aces = 0;

        for (String card : hand) {
            if (card.equals("?")) continue;
            String value = card.substring(0, card.length() - 1);
            switch (value) {
                case "A" -> { score += 11; aces++; }
                case "K", "Q", "J" -> score += 10;
                default -> score += Integer.parseInt(value);
            }
        }

        while (score > 21 && aces-- > 0) score -= 10;

        return score;
    }
}
