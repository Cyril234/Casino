import React, { useState } from 'react';
import api from './AxiosInterceptor';

type Playingattempt = {
  date: string;
  settedcoins: number;
  finishingbalance: number;
};

type BlackjackState = {
  playerHand: string[];
  dealerHand: string[];
  attempt?: Playingattempt;
  result?: string;
  status?: string;
};

type Props = {
  playerId: number;
};

const BlackJackGame: React.FC<Props> = ({ playerId }) => {
  const [state, setState] = useState<BlackjackState>({
    playerHand: [],
    dealerHand: [],
  });
  const [bet, setBet] = useState<number>(50);
  const [isGameActive, setIsGameActive] = useState(false);

  const startGame = async () => {
    try {
      const response = await api.post(`/${playerId}/start?coins=${bet}`);
      setState({
        playerHand: response.data.playerHand,
        dealerHand: response.data.dealerHand,
        attempt: response.data.attempt,
      });
      setIsGameActive(true);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Fehler beim Starten des Spiels');
    }
  };

  const hit = async () => {
    try {
      const response = await api.post(`/${playerId}/hit`);
      setState((prev) => ({
        ...prev,
        playerHand: response.data.playerHand,
        status: response.data.status,
      }));
      if (response.data.status !== 'IN_PROGRESS') {
        setIsGameActive(false);
      }
    } catch (err) {
      alert('Fehler bei Hit');
    }
  };

  const stand = async () => {
    try {
      const response = await api.post(`/${playerId}/stand`);
      setState({
        playerHand: response.data.playerHand,
        dealerHand: response.data.dealerHand,
        result: response.data.result,
        attempt: response.data.resultAttempt,
      });
      setIsGameActive(false);
    } catch (err) {
      alert('Fehler bei Stand');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-100 rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold text-center">Blackjack</h1>

      <div className="space-y-2">
        <label htmlFor="bet">Einsatz (Coins):</label>
        <input
          id="bet"
          type="number"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
          className="w-full p-2 border rounded"
          disabled={isGameActive}
        />
        <button
          onClick={startGame}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={isGameActive}
        >
          Spiel starten
        </button>
      </div>

      {state.playerHand.length > 0 && (
        <>
          <div>
            <h2 className="font-semibold">🧑 Spieler:</h2>
            <p>{state.playerHand.join(', ')}</p>
          </div>

          <div>
            <h2 className="font-semibold">🃏 Dealer:</h2>
            <p>{state.dealerHand.join(', ')}</p>
          </div>

          {isGameActive && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={hit}
                className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
              >
                Hit
              </button>
              <button
                onClick={stand}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Stand
              </button>
            </div>
          )}

          {state.status && (
            <p className="text-center text-lg font-bold mt-4">
              Status: {state.status}
            </p>
          )}

          {state.result && (
            <p className="text-center text-xl font-bold mt-4">
              Ergebnis: {state.result.replace('_', ' ')}
            </p>
          )}

          {state.attempt && (
            <div className="text-sm mt-2 text-center text-gray-600">
              Coins gesetzt: {state.attempt.settedcoins} <br />
              Neuer Kontostand: {state.attempt.finishingbalance}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlackJackGame;
