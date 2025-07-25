package com.example.casinobackend.Games.Pferderennen;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

    public static class Horse {

        int horseId;
        String name;
        double winningProbability;
        double multiplicationfactor;
        String description;

        Horse(int horseId, String name, double winningProbability, double multiplicationfactor, String description) {
            this.horseId = horseId;
            this.name = name;
            this.winningProbability = winningProbability;
            this.multiplicationfactor = multiplicationfactor;
            this.description = description;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public double getWinningProbability() {
            return winningProbability;
        }

        public void setWinningProbability(double winningProbability) {
            this.winningProbability = winningProbability;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public int getHorseId() {
            return horseId;
        }

        public void setHorseId(int horseId) {
            this.horseId = horseId;
        }

        public double getMultiplicationfactor() {
            return multiplicationfactor;
        }

        public void setMultiplicationfactor(double multiplicationfactor) {
            this.multiplicationfactor = multiplicationfactor;
        }

    }

    private final List<Horse> horses = List.of(
            new Horse(1, "Blitz", 0.25, 1.2,
                    "Ein blitzschnelles Pferd mit explosivem Start und konstant hoher Geschwindigkeit."),
            new Horse(2, "Donner", 0.20, 1.65,
                    "Kraftvoll und ausdauernd – dieses Pferd wird gegen Ende immer stärker."),
            new Horse(3, "Tornado", 0.15, 2.3, "Unberechenbar und wild – kann plötzlich an allen vorbeiziehen."),
            new Horse(4, "Wirbel", 0.10, 3.6, "Elegant und wendig – nutzt jede Lücke geschickt aus."),
            new Horse(5, "Feuer", 0.08, 4.69, "Temperamentvoll und leidenschaftlich – wenn es läuft, dann richtig."),
            new Horse(6, "Eis", 0.07, 5.57,
                    "Ruhig und kontrolliert – verliert nie die Nerven, auch in engen Situationen."),
            new Horse(7, "Sturm", 0.05, 8.10, "Kleines Kraftpaket – überrascht oft mit plötzlichen Sprints."),
            new Horse(8, "Schatten", 0.04, 10.5, "Unauffällig und leise – aber plötzlich ist es vorne."),
            new Horse(9, "Glanz", 0.03, 11, "Schön anzusehen und stilvoll – manchmal mehr Show als Tempo."),
            new Horse(10, "Pfeil", 0.03, 12, "Geradlinig und zielstrebig – braucht eine freie Bahn zum Durchstarten."));

    public List<Horse> getHorses() {
        return horses;
    }

    public Optional<Horse> findById(int id) {
        return horses.stream()
                .filter(p -> p.getHorseId() == id)
                .findFirst();
    }

    @Transactional
    public Map<String, Object> startGame(Player player, int coins, Horse horse) {
        if (player.getCoins() < coins) {
            throw new IllegalArgumentException("Nicht genügend Coins.");
        }

        player.setCoins(player.getCoins() - coins);

        return Map.of(
                "message", "Spiel gestartet",
                "horse", horse,
                "bet", coins,
                "playerBalance", player.getCoins());
    }

    public Map<String, Object> decideWinner(Player player, Horse gewaehlt, int einsatz) {
        double r = Math.random();
        double kumuliert = 0.0;
        Horse gewinner = null;
        int resultreward = 0;

        for (Horse p : horses) {
            kumuliert += p.getWinningProbability();
            if (r <= kumuliert) {
                gewinner = p;
                break;
            }
        }

        if (gewinner == null) {
            gewinner = horses.get(horses.size() - 1);
        }

        if (gewaehlt.getName().equals(gewinner.getName())) {
            double basisFaktor = 0.3 / gewinner.getWinningProbability();
            double bonusFaktor = 1.0;

            switch (gewinner.getName()) {
                case "Blitz":
                    bonusFaktor = 1.0;
                    break;
                case "Donner":
                    bonusFaktor = 1.02;
                    break;
                case "Tornado":
                    bonusFaktor = 1.03;
                    break;
                case "Wirbel":
                    bonusFaktor = 1.05;
                    break;
                case "Feuer":
                    bonusFaktor = 1.07;
                    break;
                case "Eis":
                    bonusFaktor = 1.06;
                    break;
                case "Sturm":
                    bonusFaktor = 1.10;
                    break;
                case "Schatten":
                    bonusFaktor = 1.15;
                    break;
                case "Glanz":
                    bonusFaktor = 1.20;
                    break;
                case "Pfeil":
                    bonusFaktor = 1.25;
                    break;
                default:
                    bonusFaktor = 1.0;
            }

            double auszahlung = einsatz * basisFaktor * bonusFaktor;
            resultreward = (int) Math.round(auszahlung);
            player.setCoins(player.getCoins() + resultreward);
        }

        Game game = gameRepository.findByTitle("Pferderennen").orElseThrow();

        Playingattempt result = new Playingattempt();
        result.setDate(LocalDateTime.now());
        result.setGame(game);
        result.setPlayer(player);
        result.setSettedcoins(einsatz);
        result.setFinishingbalance(player.getCoins());
        playingattemptRepository.save(result);

        return Map.of(
                "horse", gewinner,
                "coinsWon", resultreward);
    }

}
