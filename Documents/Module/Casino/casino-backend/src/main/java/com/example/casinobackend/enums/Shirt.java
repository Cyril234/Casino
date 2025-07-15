package com.example.casinobackend.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Shirt {
    WHITE("Weiss"),
    BLACK("Schwarz"),
    YELLOW("Gelb"),
    PURPLE("Violett");

    private final String label;

    Shirt(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }
}
