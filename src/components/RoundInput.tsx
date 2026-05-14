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
      <h3 class="mb-4 text-center text-2xl font-bold">Round {game.currentRound} - Enter Scores</h3>

      {/* Player Tabs */}
      <div class="mb-5 flex gap-1 overflow-x-auto">
        <For each={game.players}>
          {(player) => (
            <button
              class={`min-w-20 flex-1 cursor-pointer rounded-lg p-3 text-sm font-medium transition-all ${
                activePlayerId() === player.id
                  ? "border-primary bg-primary text-text border-2"
                  : "border-border bg-surface text-muted hover:border-primary border-2"
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
      <div class="bg-surface rounded-xl p-5">
        <h4 class="text-primary mb-5 text-center text-xl font-bold">
          {activePlayer()?.name}'s Score
        </h4>

        {/* Cards */}
        <div class="mb-5">
          <label class="text-muted mb-3 block">Validated Cards</label>
          <div class="grid grid-cols-3 gap-2">
            <For each={CARDS}>
              {(card) => (
                <button
                  class={`aspect-square cursor-pointer rounded-lg text-xl font-bold transition-all ${
                    isCardSelected(card)
                      ? "border-primary bg-primary text-text border-2"
                      : "border-border bg-surface-raised text-text hover:border-primary border-2"
                  }`}
                  onClick={() => toggleCard(card)}
                >
                  {card}
                </button>
              )}
            </For>
          </div>
          <span class="text-muted-dim mt-1 block text-right text-sm">Sum: {cardsSum()}</span>
        </div>

        {/* Symbols */}
        <div class="mb-5">
          <label class="text-muted mb-3 block">Symbols</label>
          <div class="flex items-center gap-4">
            <div class="bg-surface-raised flex-1 rounded-lg p-3 text-center">
              <span class="text-muted-dim mb-1 block text-sm">Spirals</span>
              <input
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                min="0"
                value={activeScore().spirals}
                onInput={updateSpirals}
                class="border-border bg-surface-raised text-text focus:border-primary w-20 rounded-lg border-2 p-3 text-center text-2xl font-bold focus:outline-none"
              />
            </div>
            <div class="bg-surface-raised flex-1 rounded-lg p-3 text-center">
              <span class="text-muted-dim mb-1 block text-sm">Crosses</span>
              <input
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                min="0"
                value={activeScore().crosses}
                onInput={updateCrosses}
                class="border-border bg-surface-raised text-text focus:border-primary w-20 rounded-lg border-2 p-3 text-center text-2xl font-bold focus:outline-none"
              />
            </div>
            <span
              class={`bg-surface-raised rounded-lg p-3 text-lg font-bold ${
                symbolNet() >= 0 ? "text-success" : "text-danger"
              }`}
            >
              Net: {symbolNet() >= 0 ? "+" : ""}
              {symbolNet()}
            </span>
          </div>
        </div>

        {/* Zone */}
        <div class="mb-5">
          <label class="text-muted mb-3 block">Biggest Zone (×{game.currentRound + 1})</label>
          <div class="flex items-center gap-4">
            <input
              type="number"
              inputmode="numeric"
              pattern="[0-9]*"
              min="0"
              value={activeScore().biggestZone}
              onInput={updateZone}
              class="border-border bg-surface-raised text-text focus:border-primary w-28 rounded-lg border-2 p-4 text-center text-2xl font-bold focus:outline-none"
            />
            <span class="text-success font-bold">= {zonePreview()} pts</span>
          </div>
        </div>
      </div>

      <div class="mt-5 flex gap-2">
        <button
          class="bg-surface text-text hover:bg-surface-raised flex-1 cursor-pointer rounded-xl border-none p-4 text-lg transition-all"
          onClick={handleBack}
        >
          ← Back
        </button>
        <button
          class="bg-primary text-text hover:bg-primary-light flex-2 cursor-pointer rounded-xl border-none p-4 text-lg font-bold transition-all"
          onClick={handleNext}
        >
          Review Scores →
        </button>
      </div>
    </div>
  );
}
