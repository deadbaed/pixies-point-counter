import { For } from 'solid-js'
import { game, goToPhase, confirmRound } from '../store/gameStore'
import { calcRoundScore } from '../types'
import { getRoundScores } from '../store/gameStore'

export function RoundReview() {
  const getScore = (playerId: number) => {
    const scores = getRoundScores().get(game.currentRound)
    if (!scores) return 0
    const score = scores.get(playerId)
    return score ? calcRoundScore(game.currentRound, score) : 0
  }

  function handleBack() {
    goToPhase('round-input')
  }

  function handleConfirm() {
    confirmRound()
  }

  return (
    <div class="round-review">
      <h3>Round {game.currentRound} - Review Scores</h3>

      <div class="scores-table">
        <div class="table-header">
          <span>Player</span>
          <span>Cards</span>
          <span>Spirals</span>
          <span>Crosses</span>
          <span>Zone</span>
          <span>Total</span>
        </div>

        <For each={game.players}>
          {(player) => {
            const scores = getRoundScores().get(game.currentRound)
            const score = scores?.get(player.id)
            return (
              <div class="score-row">
                <span class="player-name">{player.name}</span>
                <span>[{score?.validatedCards.join(',') || ''}]</span>
                <span>+{score?.spirals || 0}</span>
                <span>{score?.crosses ? `-${score.crosses}` : '0'}</span>
                <span>{score?.biggestZone || 0} × {game.currentRound + 1}</span>
                <span class="total">{getScore(player.id)}</span>
              </div>
            )
          }}
        </For>
      </div>

      <div class="actions">
        <button class="back-btn" onClick={handleBack}>← Edit Scores</button>
        <button class="confirm-btn" onClick={handleConfirm}>
          {game.currentRound >= 3 ? 'Finish Game' : `Next Round →`}
        </button>
      </div>
    </div>
  )
}