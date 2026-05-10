import { For, Show } from "solid-js";
import { game, setLastFinisher, startRound } from "../store/gameStore";

export function RoundStart() {
  function handleLastFinisher(playerId: number) {
    setLastFinisher(playerId);
  }

  function handleStartRound() {
    startRound();
  }

  return (
    <div class="text-center">
      <div class="mb-5 inline-block rounded-[20px] bg-[#0f3460] px-5 py-[10px] text-[1.1rem]">
        Round {game.currentRound} / 3
      </div>

      <Show when={game.currentRound < 3}>
        <div>
          <h2 class="mb-5 text-[1.8rem] text-[#e94560]">Who finished last?</h2>
          <p class="mb-[15px] text-[#aaa]">This player will start round {game.currentRound + 1}</p>
          <div class="flex flex-wrap justify-center gap-[10px]">
            <For each={game.players}>
              {(player) => (
                <button
                  class="cursor-pointer rounded-[10px] border-2 border-[#333] bg-[#16213e] px-6 py-[15px] text-[1rem] text-white transition-all hover:border-[#e94560]"
                  onClick={() => handleLastFinisher(player.id)}
                >
                  {player.name}
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>

      <Show when={game.currentRound === 3}>
        <div>
          <h2 class="mb-[10px] text-[1.8rem] text-[#e94560]">Final Round!</h2>
          <p class="mb-5 text-[#aaa]">Last chance to score points</p>
          <button
            class="cursor-pointer rounded-[10px] border-none bg-[#e94560] px-10 py-[15px] text-[1.1rem] font-bold text-white"
            onClick={handleStartRound}
          >
            Start Entering Scores
          </button>
        </div>
      </Show>
    </div>
  );
}
