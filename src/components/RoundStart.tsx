import { For } from "solid-js";
import { game, setLastFinisher } from "../store/gameStore";

export function RoundStart() {
  function handleLastFinisher(playerId: number) {
    setLastFinisher(playerId);
  }

  return (
    <div class="text-center">
      <div class="bg-surface-raised mb-5 inline-block rounded-2xl px-5 py-3 text-lg">
        Round {game.currentRound} / 3
      </div>

      <div>
        <h2 class="text-primary mb-5 text-3xl font-bold">Who finished last?</h2>
        <p class="text-muted mb-4">This player will start round {game.currentRound + 1}</p>
        <div class="flex flex-wrap justify-center gap-2">
          <For each={game.players}>
            {(player) => (
              <button
                class="border-border bg-surface text-text hover:border-primary cursor-pointer rounded-xl border-2 px-6 py-4 text-lg transition-all"
                onClick={() => handleLastFinisher(player.id)}
              >
                {player.name}
              </button>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
