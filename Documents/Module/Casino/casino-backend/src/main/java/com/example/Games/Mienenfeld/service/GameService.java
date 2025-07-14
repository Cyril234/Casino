package com.example.Games.Mienenfeld.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GameService {
    private Map<String, Game> games = new HashMap<>();

    public Game newGame() {
        Game game = new Game();
        placeBombs(game);
        countAdjacents(game);
        games.put(game.id, game);
        return game;
    }

    public Game getGame(String id) {
        return games.get(id);
    }

    public Game reveal(String id, int row, int col) {
        Game game = games.get(id);
        if (game == null || !game.status.equals("playing"))
            return game;

        Cell cell = game.board[row][col];
        if (cell.revealed)
            return game;

        cell.revealed = true;

        if (cell.bomb) {
            game.status = "lost";
        } else {
            revealArea(game, row, col);
            if (checkWin(game)) {
                game.status = "won";
            }
        }

        return game;
    }

    private void placeBombs(Game game) {
        Random rand = new Random();
        int placed = 0;
        while (placed < Game.numberOfBombs) {
            int r = rand.nextInt(Game.sizeField);
            int c = rand.nextInt(Game.sizeField);
            if (!game.board[r][c].bomb) {
                game.board[r][c].bomb = true;
                placed++;
            }
        }
    }

    private void countAdjacents(Game game) {
        for (int r = 0; r < Game.sizeField; r++) {
            for (int c = 0; c < Game.sizeField; c++) {
                if (game.board[r][c].bomb)
                    continue;
                int count = 0;
                for (int dr = -1; dr <= 1; dr++) {
                    for (int dc = -1; dc <= 1; dc++) {
                        int nr = r + dr;
                        int nc = c + dc;
                        if (inBounds(nr, nc) && game.board[nr][nc].bomb)
                            count++;
                    }
                }
                game.board[r][c].adjacent = count;
            }
        }
    }

    private void revealArea(Game game, int r, int c) {
        if (!inBounds(r, c))
            return;
        Cell cell = game.board[r][c];
        if (cell.revealed || cell.bomb)
            return;

        cell.revealed = true;
        game.revealedCount++;

        if (cell.adjacent == 0) {
            for (int dr = -1; dr <= 1; dr++) {
                for (int dc = -1; dc <= 1; dc++) {
                    if (dr != 0 || dc != 0) {
                        revealArea(game, r + dr, c + dc);
                    }
                }
            }
        }
    }

    private boolean inBounds(int r, int c) {
        return r >= 0 && r < Game.sizeField && c >= 0 && c < Game.sizeField;
    }

    private boolean checkWin(Game game) {
        return game.revealedCount == Game.sizeField * Game.sizeField - Game.numberOfBombs;
    }
}