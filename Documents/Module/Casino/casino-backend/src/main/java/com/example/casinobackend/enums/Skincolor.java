package com.example.casinobackend.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Skincolor {
    WHITE("Weiss"),
    BROWN("Braun"),
    RED("Rot"),
    BLUE("Blau");

    private final String label;

    Skincolor(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }
}
