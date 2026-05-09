import { For } from 'solid-js'
import { game, goToPhase, confirmRound } from '../store/gameStore'
import { calcRoundScore, sumCards, calcPlayerTotal } from '../types'
import { getRoundScores } from '../store/gameStore'

export function RoundReview() {
  function getRoundScore(playerId: number) {
    const scores = getRoundScores().get(game.currentRound)
    const score = scores?.get(playerId)
    return score ? calcRoundScore(game.currentRound, score) : 0
  }

  const getTotalSoFar = (playerId: number) => {
    return calcPlayerTotal(playerId, getRoundScores())
  }

  const nextRoundStarter = () => {
    if (!game.lastFinisherId) return null
    return game.players.find(p => p.id === game.lastFinisherId)
  }

  return (
    <div class="round-review">
      <h3>Round {game.currentRound}</h3>

      <div class="next-starter">
        <span class="starter-label">Next round starts:</span>
        <span class="starter-name">{nextRoundStarter()?.name}</span>
      </div>

      <div class="review-players">
        <For each={game.players}>
          {(player) => {
            const scores = getRoundScores().get(game.currentRound)
            const score = scores?.get(player.id)
            return (
              <div class="review-player-card">
                <div class="review-player-name">{player.name}</div>
                <div class="review-details">
                  <div class="review-row">
                    <span>Cards:</span>
                    <span>{sumCards(score?.validatedCards || [])} pts</span>
                  </div>
                  <div class="review-row">
                    <span>Spirals:</span>
                    <span>+{score?.spirals || 0}</span>
                  </div>
                  <div class="review-row">
                    <span>Crosses:</span>
                    <span>{score?.crosses ? `-${score.crosses}` : '0'}</span>
                  </div>
                  <div class="review-row">
                    <span>Zone:</span>
                    <span>{score?.biggestZone || 0} × {game.currentRound + 1}</span>
                  </div>
                </div>
                <div class="review-total">
                  <span class="total-label">Round {game.currentRound}</span>
                  <span class="total-value">+{getRoundScore(player.id)}</span>
                </div>
                <div class="review-grand-total">
                  <span class="grand-label">Total</span>
                  <span class="grand-value">{getTotalSoFar(player.id)} pts</span>
                </div>
              </div>
            )
          }}
        </For>
      </div>

      <div class="actions">
        <button class="back-btn" onClick={() => goToPhase('round-input')}>
          ← Edit
        </button>
        <button class="confirm-btn" onClick={confirmRound}>
          {game.currentRound >= 3 ? 'Finish' : 'Next Round →'}
        </button>
      </div>
    </div>
  )
}
