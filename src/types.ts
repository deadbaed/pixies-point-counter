// ============ Scoring ============

export type PlayerRoundScore = {
  playerId: number
  validatedCards: number[]
  spirals: number
  crosses: number
  biggestZone: number
}

// ============ Pure Functions ============

export function sumCards(cards: number[]): number {
  return cards.reduce((a, b) => a + b, 0)
}

export function calcRoundScore(round: number, data: PlayerRoundScore): number {
  const cardsSum = sumCards(data.validatedCards)
  const spiralScore = data.spirals * 1
  const crossScore = data.crosses * -1
  const zoneMultiplier = round + 1  // round 1 → ×2, round 2 → ×3, round 3 → ×4
  const zoneScore = data.biggestZone * zoneMultiplier

  return cardsSum + spiralScore + crossScore + zoneScore
}

export function getTotalScore(
  playerId: number,
  allRounds: Map<number, Map<number, PlayerRoundScore>>,
  round: number
): number {
  const roundScores = allRounds.get(round)
  if (!roundScores) return 0
  const score = roundScores.get(playerId)
  return score ? calcRoundScore(round, score) : 0
}

export function calcPlayerTotal(
  playerId: number,
  allRounds: Map<number, Map<number, PlayerRoundScore>>
): number {
  let total = 0
  allRounds.forEach((_, round) => {
    total += getTotalScore(playerId, allRounds, round)
  })
  return total
}

export function getInitialScore(playerId: number): PlayerRoundScore {
  return {
    playerId,
    validatedCards: [],
    spirals: 0,
    crosses: 0,
    biggestZone: 0,
  }
}