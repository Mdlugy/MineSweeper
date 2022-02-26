import React from 'react'
import { Board, Gamebutton } from './gameElements'

const Game = (props) => {
    if (!props.game) { return <></> }
    return (
        <>

            <Board game={props.game}>
                {props.game.board.map((square) => (
                    <Gamebutton>{square.index}</Gamebutton>
                ))}</Board>
        </>
    )
}

export default Game