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
    <div class="round-start">
      <div class="round-indicator">
        Round {game.currentRound} / 3
      </div>

      <Show when={game.currentRound < 3}>
        <div class="last-finisher">
          <h2>Who finished last?</h2>
          <p>This player will start round {game.currentRound + 1}</p>
          <div class="player-buttons">
            <For each={game.players}>
              {(player) => (
                <button
                  class="player-choice-btn"
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
        <div class="round-ready">
          <h2>Final Round!</h2>
          <p>Last chance to score points</p>
          <button class="start-turn-btn" onClick={handleStartRound}>
            Start Entering Scores
          </button>
        </div>
      </Show>
    </div>
  )
}
