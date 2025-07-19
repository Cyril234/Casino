package com.example.casinobackend.Games.Poker;

import java.util.ArrayList;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/pocker")
@CrossOrigin(origins = "http://localhost:5173")
public class PockerController {
    @PostMapping("/{playerId}/setupGame")
    public ArrayList<Player> pockerInitialize(@PathVariable Long playerId, @RequestBody PockerInitializeRequest request) {
        PockerLogik logik = PockerLogik.getInstance();
        logik.setBuyIn(request.getBuyIn());  
        logik.setBb(request.getBuyIn()/100);  
        logik.setSb(request.getBuyIn()/200); 
        logik.setUpPlayers();
        return logik.getPlayers();
    }

    @PostMapping("/dealCards")
    public ArrayList<Player> dealCards() {
        PockerLogik logik = PockerLogik.getInstance();
        logik.dealCards();
        return logik.getPlayers();
    }

    @GetMapping("/getWinner")
    public ArrayList<Player> getWinner() {
        PockerLogik logik = PockerLogik.getInstance();
        return logik.gerWinner();
    }
}
