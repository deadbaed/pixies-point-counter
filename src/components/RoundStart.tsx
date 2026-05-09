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

      <Show when={game.lastFinisherId === null}>
        <div class="last-finisher">
          <h2>Who finished last?</h2>
          <p>This player will start the next round</p>
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

      <Show when={game.lastFinisherId !== null}>
        <div class="round-ready">
          <h2>Round {game.currentRound} Ready</h2>
          <p>Last finisher: <strong>{game.players.find(p => p.id === game.lastFinisherId)?.name}</strong></p>
          <button class="start-turn-btn" onClick={handleStartRound}>
            Start Entering Scores
          </button>
        </div>
      </Show>
    </div>
  )
}