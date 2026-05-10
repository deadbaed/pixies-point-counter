import { For, Show } from 'solid-js'
import { game, setLastFinisher, startRound } from '../store/gameStore'

export function RoundStart() {
  function handleLastFinisher(playerId: number) {
    setLastFinisher(playerId)
  }

  function handleStartRound() {
    startRound()
  }

  return (
    <div class="text-center">
      <div class="inline-block px-5 py-[10px] bg-[#0f3460] rounded-[20px] mb-5 text-[1.1rem]">
        Round {game.currentRound} / 3
      </div>

      <Show when={game.currentRound < 3}>
        <div>
          <h2 class="text-[1.8rem] text-[#e94560] mb-5">Who finished last?</h2>
          <p class="mb-[15px] text-[#aaa]">This player will start round {game.currentRound + 1}</p>
          <div class="flex flex-wrap gap-[10px] justify-center">
            <For each={game.players}>
              {(player) => (
                <button
                  class="px-6 py-[15px] bg-[#16213e] border-2 border-[#333] rounded-[10px] text-white text-[1rem] cursor-pointer hover:border-[#e94560] transition-all"
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
          <p class="text-[#aaa] mb-5">Last chance to score points</p>
          <button class="px-10 py-[15px] bg-[#e94560] border-none rounded-[10px] text-white text-[1.1rem] font-bold cursor-pointer" onClick={handleStartRound}>
            Start Entering Scores
          </button>
        </div>
      </Show>
    </div>
  )
}
