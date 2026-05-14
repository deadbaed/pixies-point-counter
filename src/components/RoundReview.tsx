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
      <h3 class="mb-4 text-center text-2xl font-bold">Round {game.currentRound}</h3>

      <Show when={game.currentRound < 3}>
        <div class="bg-surface-raised mb-5 flex items-center justify-center gap-2 rounded-xl p-3">
          <span class="text-muted-dim text-sm">Next round starts:</span>
          <span class="text-primary font-bold">{nextRoundStarter()?.name}</span>
        </div>
      </Show>

      <div class="flex flex-col gap-4">
        <For each={game.players}>
          {(player) => {
            const scores = getRoundScores().get(game.currentRound);
            const score = scores?.get(player.id);
            return (
              <div class="bg-surface rounded-xl p-4">
                <div class="text-primary mb-3 text-xl font-bold">{player.name}</div>
                <div class="mb-3 flex flex-col gap-1">
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-dim">Cards:</span>
                    <span>{sumCards(score?.validatedCards || [])} pts</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-dim">Spirals:</span>
                    <span>+{score?.spirals || 0}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-dim">Crosses:</span>
                    <span>{score?.crosses ? `-${score.crosses}` : "0"}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-dim">Zone:</span>
                    <span>
                      {score?.biggestZone || 0} × {game.currentRound + 1}
                    </span>
                  </div>
                </div>
                <div class="border-border flex items-center justify-between border-t pt-3">
                  <span class="text-muted font-bold">Round {game.currentRound}</span>
                  <span class="text-primary font-bold">+{getRoundScore(player.id)}</span>
                </div>
                <div class="bg-surface-raised mt-2 flex items-center justify-between rounded-lg p-3">
                  <span class="text-muted font-bold">Total</span>
                  <span class="text-success text-xl font-bold">{getTotalSoFar(player.id)} pts</span>
                </div>
              </div>
            );
          }}
        </For>
      </div>

      <div class="mt-5 flex gap-2">
        <button
          class="bg-surface text-text hover:bg-surface-raised flex-1 cursor-pointer rounded-xl border-none p-4 text-lg transition-all"
          onClick={() => goToPhase("round-input")}
        >
          ← Edit
        </button>
        <button
          class="bg-success text-bg hover:bg-success-light flex-2 cursor-pointer rounded-xl border-none p-4 text-lg font-bold transition-all"
          onClick={confirmRound}
        >
          {game.currentRound >= 3 ? "Finish" : "Next Round →"}
        </button>
      </div>
    </div>
  );
}
