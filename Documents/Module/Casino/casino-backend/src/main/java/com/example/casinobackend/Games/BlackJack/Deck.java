package com.example.casinobackend.Games.BlackJack;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class Deck {
    private final List<String> cards = new ArrayList<>();
    private final Random random = new Random();

    public Deck() {
        String[] suits = {"♠", "♥", "♦", "♣"};
        String[] values = {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"};

        for (String suit : suits) {
            for (String value : values) {
                cards.add(value + suit);
            }
        }

        Collections.shuffle(cards);
    }

    public String drawCard() {
        return cards.remove(random.nextInt(cards.size()));
    }
}

