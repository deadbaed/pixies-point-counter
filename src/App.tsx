import { Switch, Match } from 'solid-js'
import { game } from './store/gameStore'
import { Setup } from './components/Setup'
import { RoundStart } from './components/RoundStart'
import { RoundInput } from './components/RoundInput'
import { RoundReview } from './components/RoundReview'
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

        <Match when={game.phase === 'round-input'}>
          <RoundInput />
        </Match>

        <Match when={game.phase === 'round-review'}>
          <RoundReview />
        </Match>

        <Match when={game.phase === 'results'}>
          <GameResults />
        </Match>
      </Switch>
    </div>
  )
}