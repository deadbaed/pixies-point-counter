import { createMemo } from 'solid-js'
import { game, getCurrentScore, nextPlayer, goToPhase } from '../store/gameStore'
import { calcPlayerTotal } from '../types'

export function ConfirmScore() {
  const currentScore = () => getCurrentScore()
  const currentPlayer = () => game.players[game.currentPlayerIndex]

  const total = createMemo(() => calcPlayerTotal(currentPlayer().id, game.scores))

  function handleConfirm() {
    nextPlayer()
  }

  function handleBack() {
    goToPhase('zone')
  }

  return (
    <div class="confirm-score">
      <h3>Confirm Score</h3>

      <div class="player-name">
        {currentPlayer()?.name}
      </div>

      <div class="score-breakdown">
        <div class="score-row">
          <span>Validated Cards</span>
          <span class="value">
            [{currentScore().validatedCards.join(', ')}] = {currentScore().validatedCards.reduce((a, b) => a + b, 0)}
          </span>
        </div>

        <div class="score-row">
          <span>Spirals</span>
          <span class="value">+{currentScore().spirals}</span>
        </div>

        <div class="score-row">
          <span>Crosses</span>
          <span class="value">{currentScore().crosses > 0 ? `-${currentScore().crosses}` : '0'}</span>
        </div>

        <div class="score-row">
          <span>Biggest Zone</span>
          <span class="value">
            {currentScore().biggestZone} × {game.currentRound + 1} = {currentScore().biggestZone * (game.currentRound + 1)}
          </span>
        </div>

        <div class="score-row total">
          <span>Round Score</span>
          <span class="value">{currentScore().total}</span>
        </div>

        <div class="score-row running-total">
          <span>Total (all rounds)</span>
          <span class="value">{total()}</span>
        </div>
      </div>

      <div class="actions">
        <button class="back-btn" onClick={handleBack}>
          Back
        </button>
        <button class="confirm-btn" onClick={handleConfirm}>
          Confirm &amp; Next Player
        </button>
      </div>
    </div>
  )
}