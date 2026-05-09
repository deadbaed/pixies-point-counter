import { createMemo } from 'solid-js'
import { game, getCurrentScore, updateCurrentScore, goToPhase } from '../store/gameStore'

export function BiggestZone() {
  const currentScore = () => getCurrentScore()
  const roundMultiplier = () => game.currentRound + 1 // Round 1 → ×2, etc.

  const previewScore = createMemo(() => {
    return currentScore().biggestZone * roundMultiplier()
  })

  function handleInput(e: InputEvent) {
    const input = e.currentTarget as HTMLInputElement
    const value = parseInt(input.value) || 0
    updateCurrentScore({ biggestZone: Math.max(0, value) })
  }

  function handleBack() {
    goToPhase('symbols')
  }

  function handleNext() {
    goToPhase('confirm')
  }

  return (
    <div class="biggest-zone">
      <h3>Biggest Zone</h3>

      <div class="zone-input">
        <label>Enter zone value:</label>
        <input
          type="number"
          min="0"
          max="99"
          value={currentScore().biggestZone}
          onInput={handleInput}
        />
      </div>

      <div class="zone-preview">
        <span class="zone-value">{currentScore().biggestZone}</span>
        <span class="multiplier">× {roundMultiplier()}</span>
        <span class="equals">=</span>
        <span class="preview-score">{previewScore()} pts</span>
      </div>

      <div class="actions">
        <button class="back-btn" onClick={handleBack}>← Symbols</button>
        <button class="next-btn" onClick={handleNext}>Next: Review →</button>
      </div>
    </div>
  )
}