// ============ Player ============

export type Player = {
  id: number
  name: string
}

// ============ Game State ============

export type GamePhase = 'setup' | 'round-start' | 'cards' | 'symbols' | 'zone' | 'confirm' | 'results'

export type GameState = {
  phase: GamePhase
  players: Player[]
  currentRound: number        // 1, 2, or 3
  currentPlayerIndex: number  // index in players array
  lastFinisherId: number | null
  scores: PlayerRoundScore[]
}

// ============ Scoring ============

export type PlayerRoundScore = {
  playerId: number
  round: number
  validatedCards: number[]  // e.g., [1, 5, 9]
  spirals: number
  crosses: number
  biggestZone: number
  total: number
}

// ============ Helpers ============

export function getInitialRoundScore(playerId: number, round: number): PlayerRoundScore {
  return {
    playerId,
    round,
    validatedCards: [],
    spirals: 0,
    crosses: 0,
    biggestZone: 0,
    total: 0,
  }
}

export function calcRoundScore(round: number, data: Omit<PlayerRoundScore, 'playerId' | 'round' | 'total'>): number {
  const cardsSum = data.validatedCards.reduce((a, b) => a + b, 0)
  const spiralScore = data.spirals * 1
  const crossScore = data.crosses * -1
  const zoneMultiplier = round + 1  // round 1 → ×2, round 2 → ×3, round 3 → ×4
  const zoneScore = data.biggestZone * zoneMultiplier

  return cardsSum + spiralScore + crossScore + zoneScore
}

export function calcPlayerTotal(playerId: number, allScores: PlayerRoundScore[]): number {
  return allScores
    .filter(s => s.playerId === playerId)
    .reduce((sum, s) => sum + s.total, 0)
}

export function getPlayerById(id: number, players: Player[]): Player | undefined {
  return players.find(p => p.id === id)
}