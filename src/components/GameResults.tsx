import { For, createMemo } from "solid-js";
import { game, resetGame } from "../store/gameStore";
import { calcRoundScore, calcPlayerTotal } from "../types";
import { getRoundScores } from "../store/gameStore";

export function GameResults() {
  const sortedPlayers = createMemo(() => {
    return [...game.players].sort((a, b) => {
      const scoreA = calcPlayerTotal(a.id, getRoundScores());
      const scoreB = calcPlayerTotal(b.id, getRoundScores());
      return scoreB - scoreA;
    });
  });

  const getPlayerTotal = (playerId: number) => {
    return calcPlayerTotal(playerId, getRoundScores());
  };

  const isWinner = (playerId: number) => {
    const topScore = getPlayerTotal(sortedPlayers()[0]?.id);
    return getPlayerTotal(playerId) === topScore && topScore > 0;
  };

  const getRoundScore = (playerId: number, round: number) => {
    const scores = getRoundScores().get(round);
    const score = scores?.get(playerId);
    return score ? calcRoundScore(round, score) : 0;
  };

  function handleNewGame() {
    resetGame();
  }

  return (
    <div class="text-center">
      <h1 class="text-gold mb-8 text-4xl font-bold">🏆 Game Over!</h1>

      <div class="mb-8 flex flex-col gap-2">
        <For each={sortedPlayers()}>
          {(player, index) => (
            <div
              class={`bg-surface flex items-center gap-4 rounded-xl p-4 ${
                isWinner(player.id)
                  ? "border-gold from-surface-raised to-primary border-2 bg-gradient-to-br"
                  : ""
              }`}
            >
              <span class="text-2xl">
                {index() === 0
                  ? "🥇"
                  : index() === 1
                    ? "🥈"
                    : index() === 2
                      ? "🥉"
                      : `${index() + 1}.`}
              </span>
              <span class="flex-1 text-left text-lg">{player.name}</span>
              <span class="text-success text-xl font-bold">{getPlayerTotal(player.id)} pts</span>
            </div>
          )}
        </For>
      </div>

      <div>
        <h2 class="text-muted mb-4 text-lg">Round Breakdown</h2>
        <For each={[1, 2, 3]}>
          {(round) => (
            <div class="mb-5">
              <h3 class="text-primary mb-2 text-lg font-bold">Round {round}</h3>
              <div class="flex flex-col gap-1">
                <For each={game.players}>
                  {(player) => (
                    <div class="bg-surface flex justify-between rounded-md p-2 px-4 text-sm">
                      <span>{player.name}</span>
                      <span>{getRoundScore(player.id, round)}</span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>

      <button
        class="border-primary bg-surface-raised text-primary hover:bg-primary hover:text-text mt-5 w-full cursor-pointer rounded-xl border-2 p-4 text-xl font-bold transition-all"
        onClick={handleNewGame}
      >
        Play Again
      </button>
    </div>
  );
}
