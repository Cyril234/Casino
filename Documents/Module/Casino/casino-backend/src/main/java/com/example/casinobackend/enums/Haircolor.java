package com.example.casinobackend.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Haircolor {
    BLACK("Schwarz"),
    BLOND("Blond"),
    BROWN("Braun"),
    PINK("Pink");

    private final String label;

    Haircolor(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }
}
