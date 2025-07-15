package com.example.casinobackend.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Eyecolor {
    BROWN("Braun"),
    BLUE("Blau"),
    GREEN("Grün"),
    PURPLE("Violett");

    private final String label;

    Eyecolor(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }
}
