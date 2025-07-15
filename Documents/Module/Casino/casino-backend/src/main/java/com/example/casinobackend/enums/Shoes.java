package com.example.casinobackend.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Shoes {
    FLIPFLOPS("Flipflops"),
    SNEAKERS("Sneakers"),
    FOOTBALLSHOES("Fussballschuhe"),
    SANDALS("Sandalen");

    private final String label;

    Shoes(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }
}
