import { For, Show } from "solid-js";
import { game, goToPhase, confirmRound } from "../store/gameStore";
import { calcRoundScore, sumCards, calcPlayerTotal } from "../types";
import { getRoundScores } from "../store/gameStore";

export function RoundReview() {
  function getRoundScore(playerId: number) {
    const scores = getRoundScores().get(game.currentRound);
    const score = scores?.get(playerId);
    return score ? calcRoundScore(game.currentRound, score) : 0;
  }

  const getTotalSoFar = (playerId: number) => {
    return calcPlayerTotal(playerId, getRoundScores());
  };

  const nextRoundStarter = () => {
    return game.players.find((p) => p.id === game.lastFinisherId);
  };

  return (
    <div>
      <h3 class="mb-[15px] text-center">Round {game.currentRound}</h3>

      <Show when={game.currentRound < 3}>
        <div class="mb-5 flex items-center justify-center gap-[10px] rounded-[10px] bg-[#0f3460] p-3">
          <span class="text-[0.9rem] text-[#888]">Next round starts:</span>
          <span class="font-bold text-[#e94560]">{nextRoundStarter()?.name}</span>
        </div>
      </Show>

      <div class="flex flex-col gap-[15px]">
        <For each={game.players}>
          {(player) => {
            const scores = getRoundScores().get(game.currentRound);
            const score = scores?.get(player.id);
            return (
              <div class="rounded-[10px] bg-[#16213e] p-[15px]">
                <div class="mb-[10px] text-[1.1rem] font-bold text-[#e94560]">{player.name}</div>
                <div class="mb-[10px] flex flex-col gap-[5px]">
                  <div class="flex justify-between text-[0.9rem]">
                    <span class="text-[#888]">Cards:</span>
                    <span>{sumCards(score?.validatedCards || [])} pts</span>
                  </div>
                  <div class="flex justify-between text-[0.9rem]">
                    <span class="text-[#888]">Spirals:</span>
                    <span>+{score?.spirals || 0}</span>
                  </div>
                  <div class="flex justify-between text-[0.9rem]">
                    <span class="text-[#888]">Crosses:</span>
                    <span>{score?.crosses ? `-${score.crosses}` : "0"}</span>
                  </div>
                  <div class="flex justify-between text-[0.9rem]">
                    <span class="text-[#888]">Zone:</span>
                    <span>
                      {score?.biggestZone || 0} × {game.currentRound + 1}
                    </span>
                  </div>
                </div>
                <div class="flex items-center justify-between border-t border-[#333] pt-[10px]">
                  <span class="font-bold text-[#aaa]">Round {game.currentRound}</span>
                  <span class="font-bold text-[#e94560]">+{getRoundScore(player.id)}</span>
                </div>
                <div class="mt-[5px] flex items-center justify-between rounded-lg bg-[#0f3460] p-[10px]">
                  <span class="font-bold text-[#aaa]">Total</span>
                  <span class="text-[1.2rem] font-bold text-[#2ed573]">
                    {getTotalSoFar(player.id)} pts
                  </span>
                </div>
              </div>
            );
          }}
        </For>
      </div>

      <div class="mt-5 flex gap-[10px]">
        <button
          class="flex-1 cursor-pointer rounded-[10px] border-none bg-[#333] p-[15px] text-[1rem] text-white transition-all hover:bg-[#444]"
          onClick={() => goToPhase("round-input")}
        >
          ← Edit
        </button>
        <button
          class="flex-2 cursor-pointer rounded-[10px] border-none bg-[#2ed573] p-[15px] text-[1rem] font-bold text-[#1a1a2e] transition-all hover:bg-[#7bed9f]"
          onClick={confirmRound}
        >
          {game.currentRound >= 3 ? "Finish" : "Next Round →"}
        </button>
      </div>
    </div>
  );
}
