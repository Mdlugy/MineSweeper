import React from 'react'
import { Board } from './gameElements'
import Squares from '../squares'
const Game = (props) => {
    if (!props.game) { return <></> }
    return (
        <>

            <Board game={props.game}>
                {props.game.board.map((square) => (
                    <Squares game={props.game}>{square.index}</Squares>
                ))}</Board>
        </>
    )
}

export default Game