import { createStore } from 'solid-js/store'
import type { GameState, GamePhase, PlayerRoundScore } from '../types'
import { calcRoundScore, getInitialRoundScore } from '../types'

const initialState: GameState = {
  phase: 'setup',
  players: [],
  currentRound: 1,
  currentPlayerIndex: 0,
  lastFinisherId: null,
  scores: [],
}

const [game, setGame] = createStore<GameState>(initialState)

// ============ Phase Transitions ============

export function goToPhase(phase: GamePhase) {
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
  setGame({
    phase: 'round-start',
    currentRound: 1,
    currentPlayerIndex: 0,
    lastFinisherId: null,
    scores: [],
  })
}

// ============ Round Scoring ============

export function getCurrentScore(): PlayerRoundScore {
  const playerId = game.players[game.currentPlayerIndex]?.id
  if (playerId === undefined) {
    return getInitialRoundScore(-1, game.currentRound)
  }

  // Check if score already exists for this player/round
  const existing = game.scores.find(
    s => s.playerId === playerId && s.round === game.currentRound
  )

  if (existing) return existing

  return getInitialRoundScore(playerId, game.currentRound)
}

export function updateCurrentScore(updates: Partial<PlayerRoundScore>) {
  const playerId = game.players[game.currentPlayerIndex]?.id
  if (playerId === undefined) return

  const existingIndex = game.scores.findIndex(
    s => s.playerId === playerId && s.round === game.currentRound
  )

  const current = getCurrentScore()
  const newScore: PlayerRoundScore = {
    playerId: current.playerId,
    round: current.round,
    validatedCards: current.validatedCards,
    spirals: current.spirals,
    crosses: current.crosses,
    biggestZone: current.biggestZone,
    total: current.total,
    ...updates,
  }
  newScore.total = calcRoundScore(game.currentRound, newScore)

  if (existingIndex >= 0) {
    setGame('scores', existingIndex, newScore)
  } else {
    setGame('scores', scores => [...scores, newScore])
  }
}

// ============ Navigation ============

export function nextPlayer() {
  const nextIndex = game.currentPlayerIndex + 1

  if (nextIndex >= game.players.length) {
    // All players done for this round
    if (game.currentRound >= 3) {
      goToPhase('results')
    } else {
      // Start next round
      setGame({
        currentRound: game.currentRound + 1,
        currentPlayerIndex: 0,
        lastFinisherId: null, // Reset for new round
      })
      goToPhase('round-start')
    }
  } else {
    setGame('currentPlayerIndex', nextIndex)
    goToPhase('round-start')
  }
}

export function setLastFinisher(playerId: number) {
  setGame('lastFinisherId', playerId)
  goToPhase('cards')
}

export function startPlayerTurn() {
  goToPhase('cards')
}

// ============ Export store ============

export { game, setGame }