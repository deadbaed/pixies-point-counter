# Board Game Score Counter - Implementation Plan

## Architecture Overview

### State Management
- Use SolidJS `createStore` for reactive state
- Centralized `gameStore` containing all game state

### Types (`src/types.ts`)
```typescript
type Player = {
  id: number
  name: string
}

type GamePhase = 'setup' | 'round-start' | 'cards' | 'symbols' | 'zone' | 'confirm' | 'results'

type GameState = {
  phase: GamePhase
  players: Player[]
  currentRound: number        // 1, 2, or 3
  currentPlayerIndex: number  // index in players array
  lastFinisherId: number | null
  scores: PlayerRoundScore[]
}

type PlayerRoundScore = {
  playerId: number
  round: number
  validatedCards: number[]  // e.g., [1, 5, 9]
  spirals: number
  crosses: number
  biggestZone: number
  total: number
}
```

### Pure Functions
```typescript
calcRoundScore(round, data)     // Calculate score for one round
calcPlayerTotal(playerId, scores) // Sum all rounds for a player
```

---

## App Phases & Components

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Setup     │ ──▶ │   Round Flow     │ ──▶ │   Results    │
│  (names)    │     │ (3 rounds loop)  │     │  (summary)   │
└─────────────┘     └──────────────────┘     └──────────────┘
```

### Component Structure
```
src/
├── App.tsx                 # Main router/state manager
├── components/
│   ├── Setup.tsx           # Player name input (2-5 players)
│   ├── RoundStart.tsx      # Ask last finisher
│   ├── CardGrid.tsx        # 3x3 grid with checkboxes (1-9)
│   ├── SymbolInput.tsx     # Spirals & crosses counters
│   ├── BiggestZone.tsx     # Zone input with round multiplier preview
│   ├── ConfirmScore.tsx    # Review & confirm
│   └── GameResults.tsx     # Final scores + winner
├── store/
│   └── gameStore.ts        # Centralized reactive state
└── types.ts                # Game types and helper functions
```

---

## Scoring Logic

```typescript
function calcRoundScore(round: number, data: {
  validatedCards: number[]
  spirals: number
  crosses: number
  biggestZone: number
}): number {
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

For each of 3 rounds, loop through players:

1. **Round Start** → Show who starts (based on last round's last finisher)
2. **Cards** → 3x3 grid (1-9), tap to toggle validated cards
3. **Symbols** → +/- buttons for spirals and crosses
4. **Zone** → Number input with multiplier preview
5. **Confirm** → Show calculated score, "Confirm" to move to next player

After all players in round → next round (or results if round 3 done)

---

## Game Rules Summary

- **Players**: 2 to 5
- **Rounds**: 3 total

### Per Round Scoring:
1. **Last Finisher**: Ask who finished last → they start next round
2. **Validated Cards**: Grid with cards 1-9, sum them
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
- [x] Card grid component (`src/components/CardGrid.tsx`)
- [x] Symbol input component (`src/components/SymbolInput.tsx`)
- [x] Biggest zone component (`src/components/BiggestZone.tsx`)
- [x] Confirm score component (`src/components/ConfirmScore.tsx`)
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

## Implementation Order

1. ✅ **Types** → Done
2. ✅ **Game store** → Centralized state + phase transitions
3. ✅ **Setup component** → Player name input
4. ✅ **Round flow components** → Cards, Symbols, Zone, Confirm
5. ✅ **Results component** → Final scores
6. ✅ **App wiring** → Phase-based rendering
7. ✅ **Styling** → Polish