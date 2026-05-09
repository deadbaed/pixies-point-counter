import { createStore } from 'solid-js/store'
import type { PlayerRoundScore } from '../types'
import { getInitialScore } from '../types'

// ============ All rounds stored here ============
const allRounds = new Map<number, Map<number, PlayerRoundScore>>()

// ============ Game State ============

type Phase = 'setup' | 'round-start' | 'round-input' | 'round-review' | 'results'

type Player = {
  id: number
  name: string
}

type GameState = {
  phase: Phase
  players: Player[]
  currentRound: number
  lastFinisherId: number | null
}

const [game, setGame] = createStore<GameState>({
  phase: 'setup',
  players: [],
  currentRound: 1,
  lastFinisherId: null,
})

// ============ Phase Transitions ============

export function goToPhase(phase: Phase) {
  setGame('phase', phase)
}

// ============ Player Management ============

export function addPlayer(name: string) {
  const id = game.players.length
  setGame('players', players => [...players, { id, name }])
}

export function removePlayer(id: number) {
  setGame('players', players => players.filter(p => p.id !== id))
}

export function canStartGame(): boolean {
  return game.players.length >= 2
}

export function startGame() {
  if (!canStartGame()) return
  allRounds.clear()
  initRoundScores(1)
  const currentPlayers = [...game.players]
  setGame({
    phase: 'round-start',
    players: currentPlayers,
    currentRound: 1,
    lastFinisherId: null,
  })
}

// ============ Round Scores ============

function initRoundScores(round: number) {
  const roundScores = new Map<number, PlayerRoundScore>()
  game.players.forEach(player => {
    roundScores.set(player.id, getInitialScore(player.id))
  })
  allRounds.set(round, roundScores)
}

export function getPlayerScore(playerId: number): PlayerRoundScore {
  const roundScores = allRounds.get(game.currentRound)
  if (roundScores) {
    const score = roundScores.get(playerId)
    if (score) return score
  }
  return getInitialScore(playerId)
}

export function getCurrentRoundScores(): Map<number, PlayerRoundScore> {
  return allRounds.get(game.currentRound) ?? new Map()
}

export function updatePlayerScore(playerId: number, updates: Partial<PlayerRoundScore>) {
  const roundScores = allRounds.get(game.currentRound)
  if (!roundScores) return

  const current = getPlayerScore(playerId)
  const newScore: PlayerRoundScore = {
    ...current,
    ...updates,
  }

  roundScores.set(playerId, newScore)
}

// ============ Navigation ============

export function setLastFinisher(playerId: number) {
  // This player finished last round - they start this round
  setGame('lastFinisherId', playerId)
  setGame('phase', 'round-input')
}

export function startRound() {
  setGame('phase', 'round-input')
}

export function goToReview() {
  setGame('phase', 'round-review')
}

export function confirmRound() {
  if (game.currentRound >= 3) {
    setGame('phase', 'results')
  } else {
    const nextRound = game.currentRound + 1
    initRoundScores(nextRound)
    setGame('currentRound', nextRound)
    // lastFinisherId stays - will be shown at start of next round
    setGame('phase', 'round-start')
  }
}

export function resetGame() {
  allRounds.clear()
  setGame({
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

// Re-export for convenience
export { game }