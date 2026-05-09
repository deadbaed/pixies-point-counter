import { For, createMemo } from 'solid-js'
import { game, resetGame } from '../store/gameStore'
import { calcRoundScore, calcPlayerTotal } from '../types'
import { getRoundScores } from '../store/gameStore'

export function GameResults() {
  const sortedPlayers = createMemo(() => {
    return [...game.players].sort((a, b) => {
      const scoreA = calcPlayerTotal(a.id, getRoundScores())
      const scoreB = calcPlayerTotal(b.id, getRoundScores())
      return scoreB - scoreA
    })
  })

  const getPlayerTotal = (playerId: number) => {
    return calcPlayerTotal(playerId, getRoundScores())
  }

  const isWinner = (playerId: number) => {
    const topScore = getPlayerTotal(sortedPlayers()[0]?.id)
    return getPlayerTotal(playerId) === topScore && topScore > 0
  }

  const getRoundScore = (playerId: number, round: number) => {
    const scores = getRoundScores().get(round)
    const score = scores?.get(playerId)
    return score ? calcRoundScore(round, score) : 0
  }

  function handleNewGame() {
    resetGame()
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
              <span class="final-score">{getPlayerTotal(player.id)} pts</span>
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
                  {(player) => (
                    <div class="round-score-item">
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

      <button class="new-game-btn" onClick={handleNewGame}>
        Play Again
      </button>
    </div>
  )
}