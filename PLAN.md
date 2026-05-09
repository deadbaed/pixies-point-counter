# Board Game Score Counter - Implementation Plan

## Architecture Overview

### State Management
- Use SolidJS `createStore` for reactive state
- Centralized `gameStore` containing all game state
- All rounds stored in a `Map<number, Map<number, PlayerRoundScore>>` structure

### Types (`src/types.ts`)
```typescript
type Player = {
  id: number
  name: string
}

type GamePhase = 'setup' | 'round-start' | 'round-input' | 'round-review' | 'results'

type GameState = {
  phase: GamePhase
  players: Player[]
  currentRound: number      // 1, 2, or 3
  lastFinisherId: number | null
  playerScores: Map<number, PlayerRoundScore>  // For reactivity
}

type PlayerRoundScore = {
  playerId: number
  validatedCards: number[]  // e.g., [1, 5, 9]
  spirals: number
  crosses: number
  biggestZone: number
}
```

### Pure Functions
```typescript
calcRoundScore(round, data)     // Calculate score for one round
getTotalScore(playerId, allRounds, round) // Get player's score for a specific round
calcPlayerTotal(playerId, allRounds)      // Sum all rounds for a player
```

---

## App Flow

```
┌─────────────┐     ┌─────────────────┐     ┌───────────────┐     ┌──────────────┐
│   Setup     │ ──▶ │  Round Start    │ ──▶ │  Round Input  │ ──▶ │ Round Review │ ──▶ ...
│  (names)    │     │ (last finisher) │     │ (all at once) │     │  (confirm)   │
└─────────────┘     └─────────────────┘     └───────────────┘     └──────────────┘

                                                           (after round 3)
                                                                ↓
                                                         ┌──────────────┐
                                                         │   Results   │
                                                         │  (summary)  │
                                                         └──────────────┘
```

### Component Structure
```
src/
├── App.tsx                 # Main phase routing
├── components/
│   ├── Setup.tsx           # Player name input (2-5 players)
│   ├── RoundStart.tsx      # Ask last finisher, show round indicator
│   ├── RoundInput.tsx      # Tabbed view to enter all players' scores
│   ├── RoundReview.tsx     # Table showing all scores, confirm button
│   └── GameResults.tsx     # Final scores + winner + breakdown
├── store/
│   └── gameStore.ts        # Centralized reactive state + allRounds Map
└── types.ts                # Game types and pure scoring functions
```

---

## Scoring Logic

```typescript
function calcRoundScore(round: number, data: PlayerRoundScore): number {
  const cardsSum = data.validatedCards.reduce((a, b) => a + b, 0)
  const spiralScore = data.spirals * 1
  const crossScore = data.crosses * -1
  const zoneMultiplier = round + 1  // round 1 → ×2, round 2 → ×3, round 3 → ×4
  const zoneScore = data.biggestZone * zoneMultiplier

  return cardsSum + spiralScore + crossScore + zoneScore
}
```

---

## UI/UX Flow Per Round

1. **Round Start** → Ask who finished last (for next round), show who's starting
2. **Round Input** → Tabbed interface, all players enter scores simultaneously
3. **Round Review** → Table showing all scores, "Next Round" or "Finish Game" button

---

## Game Rules Summary

- **Players**: 2 to 5
- **Rounds**: 3 total

### Per Round Scoring:
1. **Last Finisher**: Ask who finished last → they start next round
2. **Validated Cards**: Grid (1-9), sum selected cards
3. **Spirals**: count × 1
4. **Crosses**: count × -1
5. **Biggest Zone**: value × multiplier
   - Round 1 → ×2
   - Round 2 → ×3
   - Round 3 → ×4

### Final Score:
- Sum of all 3 round scores per player

---

## Implementation Status

- [x] Types defined (`src/types.ts`)
- [x] Game store (`src/store/gameStore.ts`)
- [x] Setup component (`src/components/Setup.tsx`)
- [x] Round start component (`src/components/RoundStart.tsx`)
- [x] Round input component - tabbed all-at-once (`src/components/RoundInput.tsx`)
- [x] Round review component (`src/components/RoundReview.tsx`)
- [x] Game results component (`src/components/GameResults.tsx`)
- [x] Main App wiring (`src/App.tsx`)
- [x] Styling (`src/style.css`)
- [x] Build passes

---

## Running the App

```bash
npm run dev    # Development server
npm run build  # Production build
```

---

## Key Design Decisions

1. **All players score simultaneously** - RoundInput component has tabs for each player
2. **Data stored in Maps** - `Map<round, Map<playerId, PlayerRoundScore>>` for clean round tracking
3. **Pure scoring functions** - No classes, just data + functions for testability
4. **Reactive store** - SolidJS store triggers re-renders when playerScores changes
