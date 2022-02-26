import { useState } from 'react';
import './App.css';
import Settings from './components/settings';
import Game from './components/game';
function App() {
  const [game, setGame] = useState()
  return (
    <div className="App">
      <main>
        <h1>MineSweeper</h1>
        <Settings setGame={setGame} />
        <Game game={game} />
      </main>
    </div>
  );
}

export default App;
