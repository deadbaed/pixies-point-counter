import { createMemo, For } from 'solid-js'
import { getCurrentScore, updateCurrentScore, goToPhase } from '../store/gameStore'

const CARDS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function CardGrid() {
  const currentScore = () => getCurrentScore()

  const isSelected = (card: number) => {
    return currentScore().validatedCards.includes(card)
  }

  const total = createMemo(() => {
    return currentScore().validatedCards.reduce((a, b) => a + b, 0)
  })

  function toggleCard(card: number) {
    const current = currentScore().validatedCards
    const newCards = isSelected(card)
      ? current.filter(c => c !== card)
      : [...current, card]

    updateCurrentScore({ validatedCards: newCards })
  }

  function handleNext() {
    goToPhase('symbols')
  }

  return (
    <div class="card-grid">
      <h3>Select Validated Cards (1-9)</h3>

      <div class="cards-container">
        <For each={CARDS}>
          {(card) => (
            <button
              class={`card-btn ${isSelected(card) ? 'selected' : ''}`}
              onClick={() => toggleCard(card)}
            >
              {card}
            </button>
          )}
        </For>
      </div>

      <div class="cards-summary">
        <span>Selected: [{currentScore().validatedCards.join(', ')}]</span>
        <span>Sum: {total()}</span>
      </div>

      <button class="next-btn" onClick={handleNext}>
        Next: Symbols →
      </button>
    </div>
  )
}