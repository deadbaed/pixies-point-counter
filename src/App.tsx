import { Switch, Match } from 'solid-js'
import { game } from './store/gameStore'
import { Setup } from './components/Setup'
import { RoundStart } from './components/RoundStart'
import { CardGrid } from './components/CardGrid'
import { SymbolInput } from './components/SymbolInput'
import { BiggestZone } from './components/BiggestZone'
import { ConfirmScore } from './components/ConfirmScore'
import { GameResults } from './components/GameResults'
import './style.css'

export function App() {
  return (
    <div class="app">
      <Switch>
        <Match when={game.phase === 'setup'}>
          <Setup />
        </Match>

        <Match when={game.phase === 'round-start'}>
          <RoundStart />
        </Match>

        <Match when={game.phase === 'cards'}>
          <CardGrid />
        </Match>

        <Match when={game.phase === 'symbols'}>
          <SymbolInput />
        </Match>

        <Match when={game.phase === 'zone'}>
          <BiggestZone />
        </Match>

        <Match when={game.phase === 'confirm'}>
          <ConfirmScore />
        </Match>

        <Match when={game.phase === 'results'}>
          <GameResults />
        </Match>
      </Switch>
    </div>
  )
}