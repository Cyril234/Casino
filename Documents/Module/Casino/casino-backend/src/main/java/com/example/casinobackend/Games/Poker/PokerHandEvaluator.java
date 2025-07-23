package com.example.casinobackend.Games.Poker;

import java.util.*;
import java.util.stream.Collectors;

public class PokerHandEvaluator {

    public static class Result {
        private final List<Integer> winners;
        private final Map<Integer, List<String>> winningHands;

        public Result(List<Integer> winners, Map<Integer, List<String>> winningHands) {
            this.winners = winners;
            this.winningHands = winningHands;
        }

        public List<Integer> getWinners() {
            return winners;
        }

        public Map<Integer, List<String>> getWinningHands() {
            return winningHands;
        }

        @Override
        public String toString() {
            StringBuilder sb = new StringBuilder();
            sb.append("Gewinner: ").append(winners).append("\n");
            for (Integer i : winners) {
                sb.append("Spieler ").append(i).append(": ").append(winningHands.get(i)).append("\n");
            }
            return sb.toString();
        }
    }

    public static Map<Integer, List<String>> evaluate(List<List<String>> playerCards, List<String> communityCards) {
        List<Integer> winners = new ArrayList<>();
        Map<Integer, List<String>> winningHands = new HashMap<>();
        Hand bestHand = null;

        for (int i = 0; i < playerCards.size(); i++) {
            // Hole-Cards + Community
            List<String> all = new ArrayList<>(playerCards.get(i));
            all.addAll(communityCards);

            // Alle 5‑Karten-Kombinationen
            List<List<String>> combos = generate5CardCombinations(all);
            Hand bestOfPlayer = null;
            List<String> bestCombo = null;

            for (List<String> combo : combos) {
                Hand h = new Hand(combo);
                if (bestOfPlayer == null || h.compareTo(bestOfPlayer) > 0) {
                    bestOfPlayer = h;
                    bestCombo = new ArrayList<>(combo);
                }
            }

            // Neuer höchster Wert?
            if (bestHand == null || bestOfPlayer.compareTo(bestHand) > 0) {
                bestHand = bestOfPlayer;
                winners.clear();
                winningHands.clear();
                winners.add(i);
                winningHands.put(i, bestCombo);
            }
            // Gleichstand → weiteren Gewinner hinzufügen
            else if (bestOfPlayer.compareTo(bestHand) == 0) {
                winners.add(i);
                winningHands.put(i, bestCombo);
            }
        }

        return winningHands;
    }

    private static List<List<String>> generate5CardCombinations(List<String> cards) {
        List<List<String>> res = new ArrayList<>();
        int n = cards.size();
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                for (int k = j + 1; k < n; k++)
                    for (int l = k + 1; l < n; l++)
                        for (int m = l + 1; m < n; m++)
                            res.add(Arrays.asList(
                                cards.get(i),
                                cards.get(j),
                                cards.get(k),
                                cards.get(l),
                                cards.get(m)
                            ));
        return res;
    }

    static class Hand implements Comparable<Hand> {
        private final List<String> cards;
        private int rank;
        private List<Integer> tiebreakers;

        public Hand(List<String> cards) {
            this.cards = new ArrayList<>(cards);
            // Sortiere nach Kartenwert absteigend
            this.cards.sort(Comparator.comparingInt(Hand::getCardValue).reversed());
            evaluate();
        }

        private void evaluate() {
            List<Integer> values = cards.stream()
                    .map(Hand::getCardValue)
                    .sorted(Comparator.reverseOrder())
                    .collect(Collectors.toList());

            Map<Integer, Long> freq = values.stream()
                    .collect(Collectors.groupingBy(v -> v, Collectors.counting()));

            boolean flush = cards.stream()
                    .map(c -> c.charAt(c.length() - 1))
                    .distinct().count() == 1;
            boolean straight = isStraight(values);
            List<Integer> straightHigh = getStraightTiebreaker(values);

            if (flush && straight && isRoyalFlush()) {
                rank = 9; // Royal Flush
                tiebreakers = List.of(14);
            } else if (flush && straight) {
                rank = 8; // Straight Flush
                tiebreakers = straightHigh;
            } else if (freq.containsValue(4L)) {
                rank = 7; // Four of a Kind
                tiebreakers = getSortedByCountThenRank(freq);
            } else if (freq.containsValue(3L) && freq.containsValue(2L)) {
                rank = 6; // Full House
                tiebreakers = getSortedByCountThenRank(freq);
            } else if (flush) {
                rank = 5; // Flush
                tiebreakers = getFlushTiebreaker();
            } else if (straight) {
                rank = 4; // Straight
                tiebreakers = straightHigh;
            } else if (freq.containsValue(3L)) {
                rank = 3; // Three of a Kind
                tiebreakers = getSortedByCountThenRank(freq);
            } else if (Collections.frequency(freq.values(), 2L) == 2) {
                rank = 2; // Two Pair
                tiebreakers = getSortedByCountThenRank(freq);
            } else if (freq.containsValue(2L)) {
                rank = 1; // One Pair
                tiebreakers = getSortedByCountThenRank(freq);
            } else {
                rank = 0; // High Card
                tiebreakers = values;
            }
        }

        private boolean isRoyalFlush() {
            char suit = cards.get(0).charAt(cards.get(0).length() - 1);
            Set<Integer> needed = Set.of(10, 11, 12, 13, 14);
            Set<Integer> have = cards.stream()
                    .filter(c -> c.charAt(c.length() - 1) == suit)
                    .map(Hand::getCardValue)
                    .collect(Collectors.toSet());
            return have.containsAll(needed);
        }

        private boolean isStraight(List<Integer> values) {
            SortedSet<Integer> distinct = new TreeSet<>(values);
            List<Integer> s = new ArrayList<>(distinct);
            // Wheel (A-2-3-4-5)
            if (distinct.containsAll(Arrays.asList(14, 2, 3, 4, 5))) {
                return true;
            }
            for (int i = 0; i <= s.size() - 5; i++) {
                if (s.get(i + 4) - s.get(i) == 4) {
                    return true;
                }
            }
            return false;
        }

        private List<Integer> getStraightTiebreaker(List<Integer> values) {
            SortedSet<Integer> distinct = new TreeSet<>(values);
            List<Integer> s = new ArrayList<>(distinct);
            if (distinct.containsAll(Arrays.asList(14, 2, 3, 4, 5))) {
                return List.of(5); // Wheel-High
            }
            for (int i = s.size() - 1; i >= 4; i--) {
                if (s.get(i) - s.get(i - 4) == 4) {
                    return List.of(s.get(i));
                }
            }
            return List.of();
        }

        private List<Integer> getFlushTiebreaker() {
            char suit = cards.get(0).charAt(cards.get(0).length() - 1);
            return cards.stream()
                    .filter(c -> c.charAt(c.length() - 1) == suit)
                    .map(Hand::getCardValue)
                    .sorted(Comparator.reverseOrder())
                    .limit(5)
                    .collect(Collectors.toList());
        }

        private static List<Integer> getSortedByCountThenRank(Map<Integer, Long> freq) {
            return freq.entrySet().stream()
                    .sorted(Comparator.<Map.Entry<Integer, Long>>comparingLong(Map.Entry::getValue).reversed()
                            .thenComparing(Map.Entry.<Integer, Long>comparingByKey(Comparator.reverseOrder())))
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());
        }

        @Override
        public int compareTo(Hand o) {
            if (this.rank != o.rank) {
                return Integer.compare(this.rank, o.rank);
            }
            for (int i = 0; i < Math.min(this.tiebreakers.size(), o.tiebreakers.size()); i++) {
                int cmp = Integer.compare(this.tiebreakers.get(i), o.tiebreakers.get(i));
                if (cmp != 0) {
                    return cmp;
                }
            }
            return 0;
        }

        private static int getCardValue(String card) {
            String r = card.length() == 3
                    ? card.substring(0, 2)
                    : card.substring(0, 1);
            return switch (r) {
                case "2", "3", "4", "5", "6", "7", "8", "9" -> Integer.parseInt(r);
                case "T", "10" -> 10;
                case "J" -> 11;
                case "Q" -> 12;
                case "K" -> 13;
                case "A" -> 14;
                default -> 0;
            };
        }
    }

    public static Map<Integer, List<String>> evaluateHend(List<List<String>> players, List<String> board) {

        //List<String> board = List.of("Th", "Jh", "Qd", "2h", "3h");

        Map<Integer, List<String>> result = evaluate(players, board);
        return(result);
    }
}
