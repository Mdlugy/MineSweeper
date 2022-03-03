import { useState } from 'react';
import './App.css';
import Settings from './components/settings';
import Game from './components/game';

function App() {
  const [game, setGame] = useState()
  const [newGame, setNewGame] = useState(false)
  const [startNew, setStartNew] = useState(false)
  const handleClick = e => {
    e.preventDefault();
    setStartNew(true)
  }

  return (
    <div className="App">
      <main>
        <h1>MineSweeper</h1>
        <p>{ }</p>
        <Settings game={game} startNew={startNew} setStartNew={setStartNew} setNewGame={setNewGame} setGame={setGame} />
        {game ? <Game game={game} newGame={newGame} setStartNew={setStartNew}
          setNewGame={setNewGame} /> : <></>}
        <button onClick={handleClick}>test</button>
      </main>
    </div>
  );
}

export default App;
