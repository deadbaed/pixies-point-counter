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
      <h1 class="mb-[30px] text-[2rem] text-[#ffd700]">🏆 Game Over!</h1>

      <div class="mb-[30px] flex flex-col gap-[10px]">
        <For each={sortedPlayers()}>
          {(player, index) => (
            <div
              class={`flex items-center gap-[15px] rounded-[10px] bg-[#16213e] p-[15px] ${
                isWinner(player.id)
                  ? "border-2 border-[#ffd700] bg-gradient-to-br from-[#0f3460] to-[#e94560]"
                  : ""
              }`}
            >
              <span class="text-[1.5rem]">
                {index() === 0
                  ? "🥇"
                  : index() === 1
                    ? "🥈"
                    : index() === 2
                      ? "🥉"
                      : `${index() + 1}.`}
              </span>
              <span class="flex-1 text-left">{player.name}</span>
              <span class="text-[1.2rem] font-bold text-[#2ed573]">
                {getPlayerTotal(player.id)} pts
              </span>
            </div>
          )}
        </For>
      </div>

      <div>
        <h2 class="mb-[15px] text-[#aaa]">Round Breakdown</h2>
        <For each={[1, 2, 3]}>
          {(round) => (
            <div class="mb-5">
              <h3 class="mb-[10px] text-[#e94560]">Round {round}</h3>
              <div class="flex flex-col gap-[5px]">
                <For each={game.players}>
                  {(player) => (
                    <div class="flex justify-between rounded-[5px] bg-[#16213e] p-[8px] px-[15px] text-[0.9rem]">
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
        class="mt-5 w-full cursor-pointer rounded-[10px] border-2 border-[#e94560] bg-[#0f3460] p-[15px] text-[1.1rem] font-bold text-[#e94560] transition-all hover:bg-[#e94560] hover:text-white"
        onClick={handleNewGame}
      >
        Play Again
      </button>
    </div>
  );
}
