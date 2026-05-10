import { For, Show } from 'solid-js'
import { game, goToPhase, confirmRound } from '../store/gameStore'
import { calcRoundScore, sumCards, calcPlayerTotal } from '../types'
import { getRoundScores } from '../store/gameStore'

export function RoundReview() {
  function getRoundScore(playerId: number) {
    const scores = getRoundScores().get(game.currentRound)
    const score = scores?.get(playerId)
    return score ? calcRoundScore(game.currentRound, score) : 0
  }

  const getTotalSoFar = (playerId: number) => {
    return calcPlayerTotal(playerId, getRoundScores())
  }

  const nextRoundStarter = () => {
    return game.players.find(p => p.id === game.lastFinisherId)
  }

  return (
    <div>
      <h3 class="text-center mb-[15px]">Round {game.currentRound}</h3>

      <Show when={game.currentRound < 3}>
        <div class="flex justify-center items-center gap-[10px] p-3 bg-[#0f3460] rounded-[10px] mb-5">
          <span class="text-[#888] text-[0.9rem]">Next round starts:</span>
          <span class="font-bold text-[#e94560]">{nextRoundStarter()?.name}</span>
        </div>
      </Show>

      <div class="flex flex-col gap-[15px]">
        <For each={game.players}>
          {(player) => {
            const scores = getRoundScores().get(game.currentRound)
            const score = scores?.get(player.id)
            return (
              <div class="bg-[#16213e] rounded-[10px] p-[15px]">
                <div class="text-[1.1rem] font-bold text-[#e94560] mb-[10px]">{player.name}</div>
                <div class="flex flex-col gap-[5px] mb-[10px]">
                  <div class="flex justify-between text-[0.9rem]">
                    <span class="text-[#888]">Cards:</span>
                    <span>{sumCards(score?.validatedCards || [])} pts</span>
                  </div>
                  <div class="flex justify-between text-[0.9rem]">
                    <span class="text-[#888]">Spirals:</span>
                    <span>+{score?.spirals || 0}</span>
                  </div>
                  <div class="flex justify-between text-[0.9rem]">
                    <span class="text-[#888]">Crosses:</span>
                    <span>{score?.crosses ? `-${score.crosses}` : '0'}</span>
                  </div>
                  <div class="flex justify-between text-[0.9rem]">
                    <span class="text-[#888]">Zone:</span>
                    <span>{score?.biggestZone || 0} × {game.currentRound + 1}</span>
                  </div>
                </div>
                <div class="flex justify-between items-center pt-[10px] border-t border-[#333]">
                  <span class="font-bold text-[#aaa]">Round {game.currentRound}</span>
                  <span class="font-bold text-[#e94560]">+{getRoundScore(player.id)}</span>
                </div>
                <div class="flex justify-between items-center p-[10px] bg-[#0f3460] rounded-lg mt-[5px]">
                  <span class="font-bold text-[#aaa]">Total</span>
                  <span class="text-[1.2rem] font-bold text-[#2ed573]">{getTotalSoFar(player.id)} pts</span>
                </div>
              </div>
            )
          }}
        </For>
      </div>

      <div class="flex gap-[10px] mt-5">
        <button 
          class="flex-1 p-[15px] bg-[#333] border-none rounded-[10px] text-white text-[1rem] cursor-pointer hover:bg-[#444] transition-all"
          onClick={() => goToPhase('round-input')}
        >
          ← Edit
        </button>
        <button 
          class="flex-2 p-[15px] bg-[#2ed573] border-none rounded-[10px] text-[#1a1a2e] text-[1rem] font-bold cursor-pointer hover:bg-[#7bed9f] transition-all"
          onClick={confirmRound}
        >
          {game.currentRound >= 3 ? 'Finish' : 'Next Round →'}
        </button>
      </div>
    </div>
  )
}
