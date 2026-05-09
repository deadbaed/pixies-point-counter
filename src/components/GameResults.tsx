import { For, createMemo } from 'solid-js'
import { game } from '../store/gameStore'
import { calcPlayerTotal } from '../types'

export function GameResults() {
  const sortedPlayers = createMemo(() => {
    return [...game.players].sort((a, b) => {
      const scoreA = calcPlayerTotal(a.id, game.scores)
      const scoreB = calcPlayerTotal(b.id, game.scores)
      return scoreB - scoreA // Descending order
    })
  })

  const getScore = (playerId: number) => calcPlayerTotal(playerId, game.scores)

  const isWinner = (playerId: number) => {
    const topScore = getScore(sortedPlayers()[0]?.id)
    return getScore(playerId) === topScore && topScore > 0
  }

  function handleNewGame() {
    // Reset to setup
    window.location.reload()
  }

  return (
    <div class="game-results">
      <h1>🏆 Game Over!</h1>

      <div class="leaderboard">
        <For each={sortedPlayers()}>
          {(player, index) => (
            <div class={`result-row ${isWinner(player.id) ? 'winner' : ''}`}>
              <span class="rank">
                {index() === 0 ? '🥇' : index() === 1 ? '🥈' : index() === 2 ? '🥉' : `${index() + 1}.`}
              </span>
              <span class="player-name">{player.name}</span>
              <span class="final-score">{getScore(player.id)} pts</span>
            </div>
          )}
        </For>
      </div>

      <div class="round-breakdown">
        <h2>Round Breakdown</h2>
        <For each={[1, 2, 3]}>
          {(round) => (
            <div class="round-section">
              <h3>Round {round}</h3>
              <div class="round-players">
                <For each={game.players}>
                  {(player) => {
                    const roundScore = game.scores.find(
                      s => s.playerId === player.id && s.round === round
                    )
                    return (
                      <div class="round-score-item">
                        <span>{player.name}</span>
                        <span>{roundScore?.total ?? 0}</span>
                      </div>
                    )
                  }}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>

      <button class="new-game-btn" onClick={handleNewGame}>
        Play Again
      </button>
    </div>
  )
}