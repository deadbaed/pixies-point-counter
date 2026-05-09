import { createMemo } from 'solid-js'
import { getCurrentScore, updateCurrentScore, goToPhase } from '../store/gameStore'

export function SymbolInput() {
  const currentScore = () => getCurrentScore()

  const netValue = createMemo(() => {
    return currentScore().spirals - currentScore().crosses
  })

  function updateSpirals(value: number) {
    updateCurrentScore({ spirals: Math.max(0, value) })
  }

  function updateCrosses(value: number) {
    updateCurrentScore({ crosses: Math.max(0, value) })
  }

  function handleBack() {
    goToPhase('cards')
  }

  function handleNext() {
    goToPhase('zone')
  }

  return (
    <div class="symbol-input">
      <h3>Symbols</h3>

      <div class="symbol-row">
        <div class="symbol-group">
          <label>Spirals (×1 each)</label>
          <div class="counter">
            <button onClick={() => updateSpirals(currentScore().spirals - 1)}>−</button>
            <span class="count">{currentScore().spirals}</span>
            <button onClick={() => updateSpirals(currentScore().spirals + 1)}>+</button>
          </div>
        </div>

        <div class="symbol-group">
          <label>Crosses (×-1 each)</label>
          <div class="counter">
            <button onClick={() => updateCrosses(currentScore().crosses - 1)}>−</button>
            <span class="count">{currentScore().crosses}</span>
            <button onClick={() => updateCrosses(currentScore().crosses + 1)}>+</button>
          </div>
        </div>
      </div>

      <div class="symbol-total">
        Net: <span class={netValue() >= 0 ? 'positive' : 'negative'}>
          {netValue() >= 0 ? '+' : ''}{netValue()}
        </span>
      </div>

      <div class="actions">
        <button class="back-btn" onClick={handleBack}>← Cards</button>
        <button class="next-btn" onClick={handleNext}>Next: Zone →</button>
      </div>
    </div>
  )
}