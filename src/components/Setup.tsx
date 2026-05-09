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
    <div class="setup">
      <h1>Board Game Score Counter</h1>
      <h2>Add Players (2-5)</h2>

      <div class="add-player">
        <input
          type="text"
          placeholder="Player name"
          value={inputName()}
          onInput={(e) => setInputName(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          maxLength={20}
        />
        <button onClick={handleAdd} disabled={game.players.length >= 5}>
          Add
        </button>
      </div>

      <div class="player-list">
        <For each={game.players}>
          {(player, index) => (
            <div class="player-item">
              <span class="player-number">{index() + 1}</span>
              <span class="player-name">{player.name}</span>
              <button
                class="remove-btn"
                onClick={() => removePlayer(player.id)}
              >
                ×
              </button>
            </div>
          )}
        </For>
      </div>

      <div class="player-count">
        {game.players.length} / 5 players
      </div>

      <button
        class="start-btn"
        onClick={startGame}
        disabled={!canStartGame()}
      >
        Start Game
      </button>
    </div>
  )
}