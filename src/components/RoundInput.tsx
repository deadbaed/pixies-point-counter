import { createSignal, For } from "solid-js";
import { game, getPlayerScore, updatePlayerScore, goToReview, goToPhase } from "../store/gameStore";
import { sumCards } from "../types";

const CARDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function RoundInput() {
  const [activePlayerId, setActivePlayerId] = createSignal(game.players[0]?.id ?? -1);
  const [tick, setTick] = createSignal(0);

  const activePlayer = () => game.players.find((p) => p.id === activePlayerId());

  // Force re-render by reading tick
  const activeScore = () => {
    tick(); // this will trigger re-computation when tick changes
    return getPlayerScore(activePlayerId());
  };

  function refresh() {
    setTick((t) => t + 1);
  }

  function isCardSelected(card: number) {
    return activeScore().validatedCards.includes(card);
  }

  function toggleCard(card: number) {
    const current = activeScore().validatedCards;
    const newCards = isCardSelected(card) ? current.filter((c) => c !== card) : [...current, card];
    updatePlayerScore(activePlayerId(), { validatedCards: newCards });
    refresh();
  }

  function updateSpirals(e: InputEvent) {
    const input = e.currentTarget as HTMLInputElement;
    const value = parseInt(input.value) || 0;
    updatePlayerScore(activePlayerId(), { spirals: Math.max(0, value) });
    refresh();
  }

  function updateCrosses(e: InputEvent) {
    const input = e.currentTarget as HTMLInputElement;
    const value = parseInt(input.value) || 0;
    updatePlayerScore(activePlayerId(), { crosses: Math.max(0, value) });
    refresh();
  }

  function updateZone(e: InputEvent) {
    const input = e.currentTarget as HTMLInputElement;
    const value = parseInt(input.value) || 0;
    updatePlayerScore(activePlayerId(), { biggestZone: Math.max(0, value) });
    refresh();
  }

  function handleBack() {
    goToPhase("round-start");
  }

  function handleNext() {
    goToReview();
  }

  const cardsSum = () => sumCards(activeScore().validatedCards);
  const zonePreview = () => activeScore().biggestZone * (game.currentRound + 1);
  const symbolNet = () => activeScore().spirals - activeScore().crosses;

  return (
    <div>
      <h3 class="mb-[15px] text-center">Round {game.currentRound} - Enter Scores</h3>

      {/* Player Tabs */}
      <div class="mb-5 flex gap-[5px] overflow-x-auto">
        <For each={game.players}>
          {(player) => (
            <button
              class={`min-w-[80px] flex-1 cursor-pointer rounded-lg p-3 text-[0.9rem] transition-all ${
                activePlayerId() === player.id
                  ? "border-2 border-[#e94560] bg-[#e94560] text-white"
                  : "border-2 border-[#333] bg-[#16213e] text-[#aaa] hover:border-[#e94560]"
              }`}
              onClick={() => {
                setActivePlayerId(player.id);
                refresh();
              }}
            >
              {player.name}
            </button>
          )}
        </For>
      </div>

      {/* Score Input for Active Player */}
      <div class="rounded-[10px] bg-[#16213e] p-5">
        <h4 class="mb-5 text-center text-[#e94560]">{activePlayer()?.name}'s Score</h4>

        {/* Cards */}
        <div class="mb-5">
          <label class="mb-[10px] block text-[#aaa]">Validated Cards</label>
          <div class="grid grid-cols-3 gap-2">
            <For each={CARDS}>
              {(card) => (
                <button
                  class={`aspect-square cursor-pointer rounded-lg text-[1.2rem] font-bold transition-all ${
                    isCardSelected(card)
                      ? "border-2 border-[#e94560] bg-[#e94560] text-white"
                      : "border-2 border-[#333] bg-[#0f3460] text-white hover:border-[#e94560]"
                  }`}
                  onClick={() => toggleCard(card)}
                >
                  {card}
                </button>
              )}
            </For>
          </div>
          <span class="mt-[5px] block text-right text-[0.9rem] text-[#888]">Sum: {cardsSum()}</span>
        </div>

        {/* Symbols */}
        <div class="mb-5">
          <label class="mb-[10px] block text-[#aaa]">Symbols</label>
          <div class="flex items-center gap-[15px]">
            <div class="flex-1 rounded-lg bg-[#0f3460] p-[10px] text-center">
              <span class="mb-[5px] block text-[0.8rem] text-[#888]">Spirals</span>
              <input
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                min="0"
                value={activeScore().spirals}
                onInput={updateSpirals}
                class="w-[80px] rounded-lg border-2 border-[#333] bg-[#0f3460] p-[10px] text-center text-[1.5rem] font-bold text-white focus:border-[#e94560] focus:outline-none"
              />
            </div>
            <div class="flex-1 rounded-lg bg-[#0f3460] p-[10px] text-center">
              <span class="mb-[5px] block text-[0.8rem] text-[#888]">Crosses</span>
              <input
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                min="0"
                value={activeScore().crosses}
                onInput={updateCrosses}
                class="w-[80px] rounded-lg border-2 border-[#333] bg-[#0f3460] p-[10px] text-center text-[1.5rem] font-bold text-white focus:border-[#e94560] focus:outline-none"
              />
            </div>
            <span
              class={`rounded-lg bg-[#0f3460] p-[10px] text-[1rem] font-bold ${
                symbolNet() >= 0 ? "text-[#2ed573]" : "text-[#ff4757]"
              }`}
            >
              Net: {symbolNet() >= 0 ? "+" : ""}
              {symbolNet()}
            </span>
          </div>
        </div>

        {/* Zone */}
        <div class="mb-5">
          <label class="mb-[10px] block text-[#aaa]">Biggest Zone (×{game.currentRound + 1})</label>
          <div class="flex items-center gap-[15px]">
            <input
              type="number"
              inputmode="numeric"
              pattern="[0-9]*"
              min="0"
              value={activeScore().biggestZone}
              onInput={updateZone}
              class="w-[120px] rounded-lg border-2 border-[#333] bg-[#0f3460] p-[15px] text-center text-[1.5rem] font-bold text-white focus:border-[#e94560] focus:outline-none"
            />
            <span class="font-bold text-[#2ed573]">= {zonePreview()} pts</span>
          </div>
        </div>
      </div>

      <div class="mt-5 flex gap-[10px]">
        <button
          class="flex-1 cursor-pointer rounded-[10px] border-none bg-[#333] p-[15px] text-[1rem] text-white transition-all hover:bg-[#444]"
          onClick={handleBack}
        >
          ← Back
        </button>
        <button
          class="flex-2 cursor-pointer rounded-[10px] border-none bg-[#e94560] p-[15px] text-[1rem] font-bold text-white transition-all hover:bg-[#ff6b81]"
          onClick={handleNext}
        >
          Review Scores →
        </button>
      </div>
    </div>
  );
}
