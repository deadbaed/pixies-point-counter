import { createSignal } from 'solid-js'
import type { GameState, PlayerRoundScore } from '../types'
import { getInitialScore } from '../types'

// ============ All rounds stored here ============
const allRounds = new Map<number, Map<number, PlayerRoundScore>>()

// ============ Reactive signal for current round scores ============
const [currentRoundScores, setCurrentRoundScores] = createSignal<Map<number, PlayerRoundScore>>(new Map())

// ============ Game State ============

type Phase = 'setup' | 'round-start' | 'round-input' | 'round-review' | 'results'

const [state, setState] = createSignal({
  phase: 'setup' as Phase,
  players: [] as { id: number; name: string }[],
  currentRound: 1,
  lastFinisherId: null as number | null,
})

// ============ Phase Transitions ============

export function goToPhase(phase: Phase) {
  setState(s => ({ ...s, phase }))
}

export function getPhase(): Phase {
  return state().phase
}

// ============ Player Management ============

export function addPlayer(name: string) {
  const id = state().players.length
  setState(s => ({
    ...s,
    players: [...s.players, { id, name }],
  }))
}

export function removePlayer(id: number) {
  setState(s => ({
    ...s,
    players: s.players.filter(p => p.id !== id),
  }))
}

export function canStartGame(): boolean {
  return state().players.length >= 2
}

export function startGame() {
  if (!canStartGame()) return
  allRounds.clear()
  initRoundScores(1)
  setState(s => ({
    ...s,
    phase: 'round-start',
    currentRound: 1,
    lastFinisherId: null,
  }))
}

// ============ Round Scores ============

function initRoundScores(round: number) {
  const roundScores = new Map<number, PlayerRoundScore>()
  state().players.forEach(player => {
    roundScores.set(player.id, getInitialScore(player.id))
  })
  allRounds.set(round, roundScores)
  setCurrentRoundScores(new Map(roundScores))
}

export function getPlayerScore(playerId: number): PlayerRoundScore {
  // Read from the reactive signal to track dependencies
  currentRoundScores()
  const roundScores = allRounds.get(state().currentRound)
  if (roundScores) {
    const score = roundScores.get(playerId)
    if (score) return score
  }
  return getInitialScore(playerId)
}

export function getCurrentRoundScores(): Map<number, PlayerRoundScore> {
  currentRoundScores() // track dependency
  return allRounds.get(state().currentRound) ?? new Map()
}

export function updatePlayerScore(playerId: number, updates: Partial<PlayerRoundScore>) {
  const roundScores = allRounds.get(state().currentRound)
  if (!roundScores) return

  const current = getPlayerScore(playerId)
  const newScore: PlayerRoundScore = {
    ...current,
    ...updates,
  }

  roundScores.set(playerId, newScore)
  // Update reactive signal to trigger re-renders
  setCurrentRoundScores(new Map(roundScores))
}

// ============ Navigation ============

export function setLastFinisher(playerId: number) {
  setState(s => ({ ...s, lastFinisherId: playerId, phase: 'round-input' }))
}

export function startRound() {
  setState(s => ({ ...s, phase: 'round-input' }))
}

export function goToReview() {
  setState(s => ({ ...s, phase: 'round-review' }))
}

export function confirmRound() {
  if (state().currentRound >= 3) {
    setState(s => ({ ...s, phase: 'results' }))
  } else {
    const nextRound = state().currentRound + 1
    initRoundScores(nextRound)
    setState(s => ({
      ...s,
      currentRound: nextRound,
      lastFinisherId: null,
      phase: 'round-start',
    }))
  }
}

export function resetGame() {
  allRounds.clear()
  setState({
    phase: 'setup',
    players: [],
    currentRound: 1,
    lastFinisherId: null,
  })
}

// ============ Getters for components ============

export function getRoundScores() {
  return allRounds
}

// ============ Reactive store (proxy for easy access) ============

// Create a reactive proxy that wraps the state signal
const gameProxy = new Proxy({} as GameState, {
  get(_, prop: keyof GameState) {
    const s = state()
    switch (prop) {
      case 'phase': return s.phase
      case 'players': return s.players
      case 'currentRound': return s.currentRound
      case 'lastFinisherId': return s.lastFinisherId
      case 'playerScores': return currentRoundScores()
      default: return undefined
    }
  },
  set(_, prop: keyof GameState, value) {
    if (prop === 'phase') setState(s => ({ ...s, phase: value as Phase }))
    else if (prop === 'lastFinisherId') setState(s => ({ ...s, lastFinisherId: value as number | null }))
    return true
  }
})

export { gameProxy as game }