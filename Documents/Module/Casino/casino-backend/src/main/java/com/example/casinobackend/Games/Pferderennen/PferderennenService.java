package com.example.casinobackend.Games.Pferderennen;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.casinobackend.entities.Game;
import com.example.casinobackend.entities.Player;
import com.example.casinobackend.entities.Playingattempt;
import com.example.casinobackend.repositories.GameRepository;
import com.example.casinobackend.repositories.PlayingattemptRepository;

import jakarta.transaction.Transactional;

@Service
public class PferderennenService {

    @Autowired
    private PlayingattemptRepository playingattemptRepository;

    @Autowired
    private GameRepository gameRepository;

    private final List<Pferd> pferde = List.of(
            new Pferd(1, "Blitz", 0.25, ""),
            new Pferd(2, "Donner", 0.20, ""),
            new Pferd(3, "Tornado", 0.15, ""),
            new Pferd(4, "Wirbel", 0.10, ""),
            new Pferd(5, "Feuer", 0.08, ""),
            new Pferd(6, "Eis", 0.07, ""),
            new Pferd(7, "Sturm", 0.05, ""),
            new Pferd(8, "Schatten", 0.04, ""),
            new Pferd(9, "Glanz", 0.03, ""),
            new Pferd(10, "Pfeil", 0.03, ""));

    public List<Pferd> getHorses() {
        return pferde;
    }

    @Transactional
    public Map<String, Object> startGame(Player player, int coins, Pferd pferd) {
        if (player.getCoins() < coins) {
            throw new IllegalArgumentException("Nicht genügend Coins.");
        }

        player.setCoins(player.getCoins() - coins);

        return Map.of(
                "message", "Spiel gestartet",
                "horse", pferd,
                "bet", coins,
                "playerBalance", player.getCoins());
    }

    public Pferd decideWinner(Player player, Pferd gewaehlt, int einsatz) {
        double r = Math.random();
        double kumuliert = 0.0;
        Pferd gewinner = null;

        for (Pferd p : pferde) {
            kumuliert += p.getWinProbability();
            if (r <= kumuliert) {
                gewinner = p;
                break;
            }
        }

        if (gewinner == null) {
            gewinner = pferde.get(pferde.size() - 1);
        }

        if (gewaehlt.getName().equals(gewinner.getName())) {
            double basisFaktor = 1.0 / gewinner.getWinProbability();
            double bonusFaktor = 1.0;

            switch (gewinner.getName()) {
                case "Blitz":
                    bonusFaktor = 1.0;
                    break;
                case "Donner":
                    bonusFaktor = 1.1;
                    break;
                case "Tornado":
                    bonusFaktor = 1.05;
                    break;
                case "Wirbel":
                    bonusFaktor = 1.2;
                    break;
                case "Feuer":
                    bonusFaktor = 1.3;
                    break;
                case "Eis":
                    bonusFaktor = 1.15;
                    break;
                case "Sturm":
                    bonusFaktor = 1.4;
                    break;
                case "Schatten":
                    bonusFaktor = 1.5;
                    break;
                case "Glanz":
                    bonusFaktor = 1.6;
                    break;
                case "Pfeil":
                    bonusFaktor = 1.75;
                    break;
                default:
                    bonusFaktor = 1.0;
            }

            double auszahlung = einsatz * basisFaktor * bonusFaktor;
            int resultreward = (int) Math.round(auszahlung);
            player.setCoins(player.getCoins() + resultreward);

            Game game = gameRepository.findByTitle("Pferderennen").orElseThrow();

            Playingattempt result = new Playingattempt();
            result.setDate(LocalDateTime.now());
            result.setGame(game);
            result.setPlayer(player);
            result.setSettedcoins(einsatz);
            result.setFinishingbalance(player.getCoins());
            playingattemptRepository.save(result);
        }
        return gewinner;
    }

}
