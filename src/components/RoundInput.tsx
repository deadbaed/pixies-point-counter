import { createSignal, For } from 'solid-js'
import { game, getPlayerScore, updatePlayerScore, goToReview, goToPhase } from '../store/gameStore'
import { sumCards } from '../types'

const CARDS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function RoundInput() {
  const [activePlayerId, setActivePlayerId] = createSignal(game.players[0]?.id ?? -1)
  const [tick, setTick] = createSignal(0)

  const activePlayer = () => game.players.find(p => p.id === activePlayerId())
  
  // Force re-render by reading tick
  const activeScore = () => {
    tick() // this will trigger re-computation when tick changes
    return getPlayerScore(activePlayerId())
  }

  function refresh() {
    setTick(t => t + 1)
  }

  function isCardSelected(card: number) {
    return activeScore().validatedCards.includes(card)
  }

  function toggleCard(card: number) {
    const current = activeScore().validatedCards
    const newCards = isCardSelected(card)
      ? current.filter(c => c !== card)
      : [...current, card]
    updatePlayerScore(activePlayerId(), { validatedCards: newCards })
    refresh()
  }

  function updateSpirals(delta: number) {
    updatePlayerScore(activePlayerId(), { spirals: Math.max(0, activeScore().spirals + delta) })
    refresh()
  }

  function updateCrosses(delta: number) {
    updatePlayerScore(activePlayerId(), { crosses: Math.max(0, activeScore().crosses + delta) })
    refresh()
  }

  function updateZone(e: InputEvent) {
    const input = e.currentTarget as HTMLInputElement
    const value = parseInt(input.value) || 0
    updatePlayerScore(activePlayerId(), { biggestZone: Math.max(0, value) })
    refresh()
  }

  function handleBack() {
    goToPhase('round-start')
  }

  function handleNext() {
    goToReview()
  }

  const cardsSum = () => sumCards(activeScore().validatedCards)
  const zonePreview = () => activeScore().biggestZone * (game.currentRound + 1)
  const symbolNet = () => activeScore().spirals - activeScore().crosses

  return (
    <div>
      <h3 class="text-center mb-[15px]">Round {game.currentRound} - Enter Scores</h3>

      {/* Player Tabs */}
      <div class="flex gap-[5px] mb-5 overflow-x-auto">
        <For each={game.players}>
          {(player) => (
            <button
              class={`flex-1 min-w-[80px] p-3 text-[0.9rem] rounded-lg cursor-pointer transition-all ${
                activePlayerId() === player.id 
                  ? 'bg-[#e94560] border-2 border-[#e94560] text-white' 
                  : 'bg-[#16213e] border-2 border-[#333] text-[#aaa] hover:border-[#e94560]'
              }`}
              onClick={() => {
                setActivePlayerId(player.id)
                refresh()
              }}
            >
              {player.name}
            </button>
          )}
        </For>
      </div>

      {/* Score Input for Active Player */}
      <div class="bg-[#16213e] rounded-[10px] p-5">
        <h4 class="text-center text-[#e94560] mb-5">{activePlayer()?.name}'s Score</h4>

        {/* Cards */}
        <div class="mb-5">
          <label class="block mb-[10px] text-[#aaa]">Validated Cards</label>
          <div class="grid grid-cols-5 gap-2">
            <For each={CARDS}>
              {(card) => (
                <button
                  class={`aspect-square text-[1.2rem] font-bold rounded-lg cursor-pointer transition-all ${
                    isCardSelected(card)
                      ? 'bg-[#e94560] border-2 border-[#e94560] text-white'
                      : 'bg-[#0f3460] border-2 border-[#333] text-white hover:border-[#e94560]'
                  }`}
                  onClick={() => toggleCard(card)}
                >
                  {card}
                </button>
              )}
            </For>
          </div>
          <span class="block text-right text-[#888] text-[0.9rem] mt-[5px]">Sum: {cardsSum()}</span>
        </div>

        {/* Symbols */}
        <div class="mb-5">
          <label class="block mb-[10px] text-[#aaa]">Symbols</label>
          <div class="flex gap-[15px] items-center">
            <div class="flex-1 bg-[#0f3460] p-[10px] rounded-lg text-center">
              <span class="block text-[0.8rem] text-[#888] mb-[5px]">Spirals</span>
              <div class="flex items-center justify-center gap-[15px]">
                <button 
                  class="w-[40px] h-[40px] text-[1.5rem] bg-[#0f3460] border-none rounded-full text-white cursor-pointer hover:bg-[#e94560]"
                  onClick={() => updateSpirals(-1)}
                >
                  −
                </button>
                <span class="text-[1.8rem] font-bold min-w-[50px]">{activeScore().spirals}</span>
                <button 
                  class="w-[40px] h-[40px] text-[1.5rem] bg-[#0f3460] border-none rounded-full text-white cursor-pointer hover:bg-[#e94560]"
                  onClick={() => updateSpirals(1)}
                >
                  +
                </button>
              </div>
            </div>
            <div class="flex-1 bg-[#0f3460] p-[10px] rounded-lg text-center">
              <span class="block text-[0.8rem] text-[#888] mb-[5px]">Crosses</span>
              <div class="flex items-center justify-center gap-[15px]">
                <button 
                  class="w-[40px] h-[40px] text-[1.5rem] bg-[#0f3460] border-none rounded-full text-white cursor-pointer hover:bg-[#e94560]"
                  onClick={() => updateCrosses(-1)}
                >
                  −
                </button>
                <span class="text-[1.8rem] font-bold min-w-[50px]">{activeScore().crosses}</span>
                <button 
                  class="w-[40px] h-[40px] text-[1.5rem] bg-[#0f3460] border-none rounded-full text-white cursor-pointer hover:bg-[#e94560]"
                  onClick={() => updateCrosses(1)}
                >
                  +
                </button>
              </div>
            </div>
            <span class={`text-[1rem] font-bold bg-[#0f3460] p-[10px] rounded-lg ${
              symbolNet() >= 0 ? 'text-[#2ed573]' : 'text-[#ff4757]'
            }`}>
              Net: {symbolNet() >= 0 ? '+' : ''}{symbolNet()}
            </span>
          </div>
        </div>

        {/* Zone */}
        <div class="mb-5">
          <label class="block mb-[10px] text-[#aaa]">Biggest Zone (×{game.currentRound + 1})</label>
          <div class="flex items-center gap-[15px]">
            <input
              type="number"
              min="0"
              value={activeScore().biggestZone}
              onInput={updateZone}
              class="w-[100px] max-w-[100px] p-[10px] text-[1.2rem] text-center bg-[#0f3460] border-2 border-[#333] rounded-lg text-white focus:outline-none focus:border-[#e94560]"
            />
            <span class="text-[#2ed573] font-bold">= {zonePreview()} pts</span>
          </div>
        </div>
      </div>

      <div class="flex gap-[10px] mt-5">
        <button 
          class="flex-1 p-[15px] bg-[#333] border-none rounded-[10px] text-white text-[1rem] cursor-pointer hover:bg-[#444] transition-all"
          onClick={handleBack}
        >
          ← Back
        </button>
        <button 
          class="flex-2 p-[15px] bg-[#e94560] border-none rounded-[10px] text-white text-[1rem] font-bold cursor-pointer hover:bg-[#ff6b81] transition-all"
          onClick={handleNext}
        >
          Review Scores →
        </button>
      </div>
    </div>
  )
}
