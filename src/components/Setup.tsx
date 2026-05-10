import { createSignal, For } from 'solid-js'
import { game, addPlayer, removePlayer, startGame, canStartGame } from '../store/gameStore'

export function Setup() {
  const [inputName, setInputName] = createSignal('')

  function handleAdd() {
    const name = inputName().trim()
    if (name && game.players.length < 5) {
      addPlayer(name)
      setInputName('')
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div class="text-center">
      <h1 class="mb-[10px] text-[#e94560]">Board Game Score Counter</h1>
      <h2 class="mb-5 text-[1.2rem] text-[#aaa]">Add Players (2-5)</h2>

      <div class="flex gap-[10px] mb-5">
        <input
          type="text"
          placeholder="Player name"
          value={inputName()}
          onInput={(e) => setInputName(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          maxLength={20}
          class="flex-1 p-3 border-2 border-[#333] rounded-lg bg-[#16213e] text-white text-[1rem] focus:outline-none focus:border-[#e94560]"
        />
        <button 
          onClick={handleAdd} 
          disabled={game.players.length >= 5}
          class="px-5 py-3 bg-[#e94560] border-none rounded-lg text-white font-bold disabled:bg-[#555] disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      <div class="flex flex-col gap-[10px] mb-5">
        <For each={game.players}>
          {(player, index) => (
            <div class="flex items-center gap-[10px] p-3 bg-[#16213e] rounded-lg">
              <span class="w-[30px] h-[30px] bg-[#e94560] rounded-full flex items-center justify-center font-bold">
                {index() + 1}
              </span>
              <span class="flex-1 text-left">{player.name}</span>
              <button
                class="w-[30px] h-[30px] bg-[#ff4757] border-none rounded-full text-white text-[1.2rem] cursor-pointer"
                onClick={() => removePlayer(player.id)}
              >
                ×
              </button>
            </div>
          )}
        </For>
      </div>

      <div class="mb-5 text-[#888]">
        {game.players.length} / 5 players
      </div>

      <button
        class="w-full p-[15px] bg-[#0f3460] border-2 border-[#e94560] rounded-[10px] text-[#e94560] text-[1.1rem] font-bold disabled:border-[#555] disabled:text-[#555] disabled:cursor-not-allowed hover:bg-[#e94560] hover:text-white transition-all"
        onClick={startGame}
        disabled={!canStartGame()}
      >
        Start Game
      </button>
    </div>
  )
}
