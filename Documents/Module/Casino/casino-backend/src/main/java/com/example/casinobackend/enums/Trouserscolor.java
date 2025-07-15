package com.example.casinobackend.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Trouserscolor {
    GRAY("Grau"),
    PURPLE("Violett"),
    PINK("Pink");

    private final String label;

    Trouserscolor(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }
}
