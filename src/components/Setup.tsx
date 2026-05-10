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
      <h1 class="mb-[10px] text-[#e94560]">Board Game Score Counter</h1>
      <h2 class="mb-5 text-[1.2rem] text-[#aaa]">Add Players (2-5)</h2>

      <div class="mb-5 flex gap-[10px]">
        <input
          type="text"
          placeholder="Player name"
          value={inputName()}
          onInput={(e) => setInputName(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          maxLength={20}
          class="flex-1 rounded-lg border-2 border-[#333] bg-[#16213e] p-3 text-[1rem] text-white focus:border-[#e94560] focus:outline-none"
        />
        <button
          onClick={handleAdd}
          disabled={game.players.length >= 5}
          class="rounded-lg border-none bg-[#e94560] px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-[#555]"
        >
          Add
        </button>
      </div>

      <div class="mb-5 flex flex-col gap-[10px]">
        <For each={game.players}>
          {(player, index) => (
            <div class="flex items-center gap-[10px] rounded-lg bg-[#16213e] p-3">
              <span class="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#e94560] font-bold">
                {index() + 1}
              </span>
              <span class="flex-1 text-left">{player.name}</span>
              <button
                class="h-[30px] w-[30px] cursor-pointer rounded-full border-none bg-[#ff4757] text-[1.2rem] text-white"
                onClick={() => removePlayer(player.id)}
              >
                ×
              </button>
            </div>
          )}
        </For>
      </div>

      <div class="mb-5 text-[#888]">{game.players.length} / 5 players</div>

      <button
        class="w-full rounded-[10px] border-2 border-[#e94560] bg-[#0f3460] p-[15px] text-[1.1rem] font-bold text-[#e94560] transition-all hover:bg-[#e94560] hover:text-white disabled:cursor-not-allowed disabled:border-[#555] disabled:text-[#555]"
        onClick={startGame}
        disabled={!canStartGame()}
      >
        Start Game
      </button>
    </div>
  );
}
