import { createSignal, For } from "solid-js";
import { game, addPlayer, removePlayer, startGame, canStartGame } from "../store/gameStore";

export function Setup() {
  const [inputName, setInputName] = createSignal("");

  function handleAdd() {
    const name = inputName().trim();
    if (name && game.players.length < 5) {
      addPlayer(name);
      setInputName("");
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      handleAdd();
    }
  }

  return (
    <div class="text-center">
      <h1 class="text-primary mb-2 text-3xl font-bold">Board Game Score Counter</h1>
      <h2 class="text-muted mb-5 text-xl">Add Players (2-5)</h2>

      <div class="mb-5 flex gap-2">
        <input
          type="text"
          placeholder="Player name"
          value={inputName()}
          onInput={(e) => setInputName(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          maxLength={20}
          class="border-border bg-surface text-text focus:border-primary flex-1 rounded-lg border-2 p-3 text-lg focus:outline-none"
        />
        <button
          onClick={handleAdd}
          disabled={game.players.length >= 5}
          class="bg-primary text-text disabled:bg-muted-dim rounded-lg border-none px-5 py-3 font-bold disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      <div class="mb-5 flex flex-col gap-2">
        <For each={game.players}>
          {(player, index) => (
            <div class="bg-surface flex items-center gap-2 rounded-lg p-3">
              <span class="bg-primary text-text flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold">
                {index() + 1}
              </span>
              <span class="flex-1 text-left text-lg">{player.name}</span>
              <button
                class="bg-danger text-text h-8 w-8 cursor-pointer rounded-full border-none text-xl"
                onClick={() => removePlayer(player.id)}
              >
                ×
              </button>
            </div>
          )}
        </For>
      </div>

      <div class="text-muted-dim mb-5">{game.players.length} / 5 players</div>

      <button
        class="border-primary bg-surface-raised text-primary hover:bg-primary hover:text-text disabled:border-border disabled:text-muted-dim w-full rounded-xl border-2 p-4 text-xl font-bold transition-all disabled:cursor-not-allowed"
        onClick={startGame}
        disabled={!canStartGame()}
      >
        Start Game
      </button>
    </div>
  );
}
