package com.example.casinobackend.dataTransferObject;

public class LoginPasswordRequest {
        private String username;
    private String password;

    // Standard-Konstruktor
    public LoginPasswordRequest() {}

    // Getter und Setter
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
