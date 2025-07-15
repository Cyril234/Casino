package com.example.casinobackend.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Headgear {
    CAP("Kappe"),
    COWBOYHAT("Cowboyhut"),
    STRAWHAT("Strohhut");

    private final String label;

    Headgear(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }
}