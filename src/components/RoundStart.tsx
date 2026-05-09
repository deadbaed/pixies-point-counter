import { For, Show } from 'solid-js'
import { game, setLastFinisher, startPlayerTurn } from '../store/gameStore'
import { calcPlayerTotal } from '../types'

export function RoundStart() {
  const currentPlayer = () => game.players[game.currentPlayerIndex]

  function handleLastFinisher(playerId: number) {
    setLastFinisher(playerId)
  }

  function handleStartTurn() {
    startPlayerTurn()
  }

  function handleNextStep() {
    if (game.lastFinisherId === null) {
      handleStartTurn()
    }
  }

  // Get scores so far for display
  const getPlayerScore = (id: number) => {
    const total = calcPlayerTotal(id, game.scores)
    return total > 0 ? `(${total} pts)` : ''
  }

  return (
    <div class="round-start">
      <div class="round-indicator">
        Round {game.currentRound} / 3
      </div>

      <div class="current-player">
        <h2>{currentPlayer()?.name}'s Turn</h2>
      </div>

      <Show when={game.lastFinisherId !== null}>
        <div class="last-finisher">
          <p>Who finished last this round?</p>
          <div class="player-buttons">
            <For each={game.players}>
              {(player) => (
                <button
                  class="player-choice-btn"
                  onClick={() => handleLastFinisher(player.id)}
                >
                  {player.name}
                  <span class="score-hint">{getPlayerScore(player.id)}</span>
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>

      <Show when={game.lastFinisherId === null}>
        <button class="start-turn-btn" onClick={handleNextStep}>
          Begin Round {game.currentRound}
        </button>
      </Show>
    </div>
  )
}