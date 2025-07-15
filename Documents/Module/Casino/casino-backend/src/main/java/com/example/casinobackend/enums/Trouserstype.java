package com.example.casinobackend.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Trouserstype {
    LONG("Lang"),
    SHORT("Kurz");

    private final String label;

    Trouserstype(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }
}
