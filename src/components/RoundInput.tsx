import { createSignal, For, createMemo } from 'solid-js'
import { game, getPlayerScore, updatePlayerScore, goToReview, goToPhase } from '../store/gameStore'

const CARDS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function RoundInput() {
  const [activePlayerId, setActivePlayerId] = createSignal(game.players[0]?.id ?? -1)

  const activePlayer = () => game.players.find(p => p.id === activePlayerId())
  const activeScore = createMemo(() => getPlayerScore(activePlayerId()))

  function isCardSelected(card: number) {
    return activeScore().validatedCards.includes(card)
  }

  function toggleCard(card: number) {
    const current = activeScore().validatedCards
    const newCards = isCardSelected(card)
      ? current.filter(c => c !== card)
      : [...current, card]
    updatePlayerScore(activePlayerId(), { validatedCards: newCards })
  }

  function updateSpirals(delta: number) {
    updatePlayerScore(activePlayerId(), { spirals: Math.max(0, activeScore().spirals + delta) })
  }

  function updateCrosses(delta: number) {
    updatePlayerScore(activePlayerId(), { crosses: Math.max(0, activeScore().crosses + delta) })
  }

  function updateZone(e: InputEvent) {
    const input = e.currentTarget as HTMLInputElement
    const value = parseInt(input.value) || 0
    updatePlayerScore(activePlayerId(), { biggestZone: Math.max(0, value) })
  }

  function handleBack() {
    goToPhase('round-start')
  }

  function handleNext() {
    goToReview()
  }

  const cardsSum = () => activeScore().validatedCards.reduce((a, b) => a + b, 0)
  const zonePreview = () => activeScore().biggestZone * (game.currentRound + 1)
  const symbolNet = () => activeScore().spirals - activeScore().crosses

  return (
    <div class="round-input">
      <h3>Round {game.currentRound} - Enter Scores</h3>

      {/* Player Tabs */}
      <div class="player-tabs">
        <For each={game.players}>
          {(player) => (
            <button
              class={`player-tab ${activePlayerId() === player.id ? 'active' : ''}`}
              onClick={() => setActivePlayerId(player.id)}
            >
              {player.name}
            </button>
          )}
        </For>
      </div>

      {/* Score Input for Active Player */}
      <div class="score-input-section">
        <h4>{activePlayer()?.name}'s Score</h4>

        {/* Cards */}
        <div class="input-group">
          <label>Validated Cards</label>
          <div class="cards-container">
            <For each={CARDS}>
              {(card) => (
                <button
                  class={`card-btn ${isCardSelected(card) ? 'selected' : ''}`}
                  onClick={() => toggleCard(card)}
                >
                  {card}
                </button>
              )}
            </For>
          </div>
          <span class="input-hint">Sum: {cardsSum()}</span>
        </div>

        {/* Symbols */}
        <div class="input-group">
          <label>Symbols</label>
          <div class="symbol-row">
            <div class="symbol-group">
              <span>Spirals</span>
              <div class="counter">
                <button onClick={() => updateSpirals(-1)}>−</button>
                <span class="count">{activeScore().spirals}</span>
                <button onClick={() => updateSpirals(1)}>+</button>
              </div>
            </div>
            <div class="symbol-group">
              <span>Crosses</span>
              <div class="counter">
                <button onClick={() => updateCrosses(-1)}>−</button>
                <span class="count">{activeScore().crosses}</span>
                <button onClick={() => updateCrosses(1)}>+</button>
              </div>
            </div>
            <span class={`symbol-net ${symbolNet() >= 0 ? 'positive' : 'negative'}`}>
              Net: {symbolNet() >= 0 ? '+' : ''}{symbolNet()}
            </span>
          </div>
        </div>

        {/* Zone */}
        <div class="input-group">
          <label>Biggest Zone (×{game.currentRound + 1})</label>
          <div class="zone-row">
            <input
              type="number"
              min="0"
              value={activeScore().biggestZone}
              onInput={updateZone}
            />
            <span class="zone-preview">= {zonePreview()} pts</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="back-btn" onClick={handleBack}>← Back</button>
        <button class="next-btn" onClick={handleNext}>Review Scores →</button>
      </div>
    </div>
  )
}