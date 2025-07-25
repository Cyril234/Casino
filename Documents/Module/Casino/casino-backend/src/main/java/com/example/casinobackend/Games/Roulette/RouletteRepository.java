package com.example.casinobackend.Games.Roulette;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.casinobackend.entities.Game;
import com.example.casinobackend.entities.Player;
import com.example.casinobackend.entities.Playingattempt;
import com.example.casinobackend.repositories.PlayerRepository;
import com.example.casinobackend.repositories.PlayingattemptRepository;

@Repository
public class RouletteRepository {

    public static class BetRequest {
        public String type;
        public String value;
        public int amount;

        public BetRequest() {}
        public BetRequest(String type, String value, int amount) {
            this.type = type;
            this.value = value;
            this.amount = amount;
        }
    }

    private static final Set<Integer> RED_NUMBERS = Set.of(1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36);
    private static final Set<Integer> BLACK_NUMBERS = Set.of(2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35);

    
    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private PlayingattemptRepository playingattemptRepo;

    private int rollNumber() {
        return new Random().nextInt(37);
    }

    private String getColor(int number) {
        if (number == 0) return "GREEN";
        if (RED_NUMBERS.contains(number)) return "RED";
        if (BLACK_NUMBERS.contains(number)) return "BLACK";
        return "UNKNOWN";
    }

    @Transactional
    public Map<String, Object> spinMulti(Player player, Game game, List<BetRequest> bets) {
        int rolledNumber = rollNumber();
        String rolledColor = getColor(rolledNumber);

        int totalBet = bets.stream().mapToInt(b -> b.amount).sum();

        if (player.getCoins() < totalBet) {
            throw new RuntimeException("Nicht genug Coins für alle Wetten");
        }

        player.setCoins(player.getCoins() - totalBet);

        int totalPayout = 0;

        for (BetRequest bet : bets) {
            if (checkWin(rolledNumber, rolledColor, bet)) {
                int payout = bet.amount * getPayoutMultiplier(bet.type);
                totalPayout += payout;
            }
        }

        player.setCoins(player.getCoins() + totalPayout);

        playerRepository.save(player);

        Map<String, Object> result = new HashMap<>();
        result.put("rolledNumber", rolledNumber);
        result.put("rolledColor", rolledColor);
        result.put("totalBet", totalBet);
        result.put("totalPayout", totalPayout);
        result.put("newBalance", player.getCoins());
        result.put("result", totalPayout > 0 ? "WIN" : "LOSE");

        Playingattempt attempt = new Playingattempt();
        attempt.setDate(LocalDateTime.now());
        attempt.setGame(game);
        attempt.setPlayer(player);
        attempt.setSettedcoins(totalBet);
        attempt.setFinishingbalance(player.getCoins());

        playingattemptRepo.save(attempt);

        return result;
    }

    private boolean checkWin(int rolledNumber, String rolledColor, BetRequest bet) {
        switch (bet.type.toUpperCase()) {
            case "NUMBER":
                return Integer.toString(rolledNumber).equals(bet.value);
            case "COLOR":
                return rolledColor.equalsIgnoreCase(bet.value);
            case "DOZEN":
                int dozen = getDozen(rolledNumber);
                return dozen > 0 && bet.value.equalsIgnoreCase(dozenToString(dozen));
            case "ROW":
                int row = getRow(rolledNumber);
                return row > 0 && bet.value.equalsIgnoreCase("ROW" + row);
            case "EVENODD":
                if (rolledNumber == 0) return false;
                return ("EVEN".equalsIgnoreCase(bet.value) && rolledNumber % 2 == 0)
                    || ("ODD".equalsIgnoreCase(bet.value) && rolledNumber % 2 != 0);
            case "HIGHLOW":
                if (rolledNumber == 0) return false;
                return ("LOW".equalsIgnoreCase(bet.value) && rolledNumber <= 18)
                    || ("HIGH".equalsIgnoreCase(bet.value) && rolledNumber >= 19);
            default:
                return false;
        }
    }

    private int getPayoutMultiplier(String betType) {
        return switch (betType.toUpperCase()) {
            case "NUMBER" -> 35;
            case "COLOR", "EVENODD", "HIGHLOW" -> 2;
            case "DOZEN", "ROW" -> 3;
            default -> 0;
        };
    }

    private int getDozen(int number) {
        if (number >= 1 && number <= 12) return 1;
        if (number >= 13 && number <= 24) return 2;
        if (number >= 25 && number <= 36) return 3;
        return 0;
    }

    private String dozenToString(int dozen) {
        return switch (dozen) {
            case 1 -> "1ST12";
            case 2 -> "2ND12";
            case 3 -> "3RD12";
            default -> "";
        };
    }

    private int getRow(int number) {
        if (number == 0) return 0;
        int mod = number % 3;
        return mod == 1 ? 1 : mod == 2 ? 2 : 3;
    }
}
