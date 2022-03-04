import React, { useState } from 'react';
import { Form } from './settingsElements'
import { Globals } from '../gameLogic/Globals';
import GameBoard from '../gameLogic/GameBoard';

const Settings = (props) => {
    const [width, setWidth] = useState(Globals.minWidth)
    const [height, setHeight] = useState(Globals.minHeight)
    const [difficulty, setDifficulty] = useState("easy")
    const options = [
        { value: "easy", fraction: "1/10", label: "Easy" },
        { value: "medium", fraction: "1/5", label: "Medium" },
        { value: "hard", fraction: "1/3", label: "Hard" },
    ]
    const NewGame = () => {
        let invalid = GameBoard.inValidate(height, width, difficulty)
        if (invalid) {
            alert(invalid);
            return
        }
        let newGame = new GameBoard(parseInt(height), parseInt(width), difficulty)
        props.setGame(newGame)
        props.setNewGame(true)
    }
    if (props.startNew) { NewGame(); props.setStartNew(false) }

    const handleSubmit = e => {
        e.preventDefault();
        NewGame()
    }

    return (<>
        <Form onSubmit={handleSubmit}>
            <label>Height: <input name="height" type="number" onChange={(e) => setHeight(e.target.value)} value={height} min={Globals.minHeight} max={Globals.maxHeight} /></label>
            <label>Width: <input name="width" type="number" onChange={(e) => setWidth(e.target.value)} value={width} min={Globals.minWIdth} max={Globals.maxWidth} /></label>
            <label className='selectLabel'>Difficulty:
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <optgroup label="Choose your difficulty">
                        {options.map((option) => (
                            <option value={option.value} title={option.fraction + " of all squares are bombs"}>{option.label}</option>
                        ))}
                    </optgroup>
                </select >
            </label>
            <button type="submit">New game</button>
        </Form>
    </>)
}

export default Settings