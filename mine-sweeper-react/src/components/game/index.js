import React, { useEffect, useState } from 'react'
import Square from '../gameLogic/Square'
import { Board } from './gameElements'
import Squares from '../squares'
import { Globals } from '../gameLogic/Globals'
const Game = (props) => {
    const [lost, setLost] = useState(false)
    const [check, setCheck] = useState(false)
    if (props.newGame) {
        Square.flagged = []
        Square.used = []
        props.setNewGame(false)
    }

    useEffect(() => {

        setCheck(false)
        console.log(Square.used.length, props.game.correct)
        if (Square.used.length === props.game.correct) {

            setTimeout(() => {
                if (window.confirm(Globals.alerts.Win)) {
                    props.setStartNew(true)
                }
            }, 100)

        }
    }, [check])

    if (!props.game) { return <></> }
    props.game.buildSquares();

    return (
        <>
            <Board game={props.game}>
                {props.game.squares.map((square) =>
                    <Squares check={check} setCheck={setCheck} game={props.game} key={`Square${square.index}`} square={square} setStartNew={props.setStartNew} setLost={setLost} lost={lost} ></Squares>
                )}</Board>
        </>
    )
}

export default Game