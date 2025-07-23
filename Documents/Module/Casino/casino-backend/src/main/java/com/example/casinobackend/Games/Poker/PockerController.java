package com.example.casinobackend.Games.Poker;

import java.util.ArrayList;
import java.util.List;
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
    @PostMapping("/setupGame")
    public ArrayList<Player> pockerInitialize(@RequestBody PockerInitializeRequest request) {
        PockerLogik logik = new PockerLogik();
        return logik.setUpPlayers(request.getBuyIn());
    }

    @PostMapping("/dealCards")
    public Map<String, Object> dealCards(@RequestBody ArrayList<Player> players) {
        PockerLogik logik = new PockerLogik();
        return logik.dealCards(players);
    }

    @PostMapping("/getWinner")
    public List<Integer> getWinner(@RequestBody PockerGetWinnerRequest pockerGetWinnerRequest) {
        PockerLogik logik = new PockerLogik();
        return logik.getWinner(pockerGetWinnerRequest.getPlayers(), pockerGetWinnerRequest.getTableCards());
    }

    @PostMapping("/getNPCDesision")
    public Map<String, Object> getNPCDesision(@RequestBody int potGroesse, int callAmount, int bigBlind, List<String> tableCards, List<String> handCards, int round, String style, int stack, int position) {
        PockerLogik logik = new PockerLogik();

        return logik.getNPCDecision(potGroesse, callAmount, bigBlind, tableCards, handCards, round, style, stack, position);

    }
}
