import React, { useEffect } from 'react'
import Square from '../gameLogic/Square'
import { useState } from 'react'
import { Gamebutton, GameSquare } from './squaresElements'

// const Squares = (props) => {
//     const Square = props.game.squares[props.index]
//     useEffect(() => { if (Square.loopHit) { Square.hit() } }, [])
//     const handleClick = (e) => {
//         e.preventDefault();
//         Square.hit()
//     }
//     const handleRight = (e) => {
//         e.preventDefault();
//         Square.right()
//     }
//     return (
//         <Gamebutton onClick={handleClick} onContextMenu={handleRight}></Gamebutton>
//     )
// }
const Squares = (props) => {
    props.square.init(props.game);
    const [squareval, setSquareVal] = useState("")
    const [clicked, setClicked] = useState(props.square.clicked)
    const [inner, setInner] = useState(props.square.totalAdjacent)
    const [bg, setbg] = useState("#5f7577")

    useEffect(() => {
        // resets square to unclicked when new game object is instantiated
        setClicked(false)
        setbg("#5f7577")
        setInner(props.square.totalAdjacent)
        setSquareVal("")
        Square.flagged = []
        Square.used = []
    }, [props.game, props.square.totalAdjacent]);

    useEffect(() => {
        setClicked(props.square.clicked)
    }, [props.check, props.square.clicked])

    const handleClick = (e) => {
        e.preventDefault();
        if (props.square.noClick()) { return }
        if (props.square.bomb === 1) {
            setInner("💣")
            setbg("white")
            setClicked(true)
            props.setLostSquare(props.square.index)
        }
        else if (props.square.bomb === 0) {
            props.square.click()
            props.setCheck(true)
        }
    }
    const handleRight = (e) => {
        e.preventDefault();
        switch (squareval) {
            case "🚩":
                setSquareVal("?")
                break;
            case "?":
                setSquareVal("")
                Square.flagged.splice(Square.flagged.indexOf(props.square.index), 1);
                break;
            default:
                setSquareVal("🚩")
                Square.flagged.push(props.square.index)
                break;
        }
    }
    if (props.lost && props.lostSquare !== props.square.index) {
        if (props.square.bomb === 1) {
            setbg("red")
            setInner("💣")
        }
    }

    return (
        <>
            {clicked ?
                <GameSquare style={{ color: props.square.textColors[props.square.totalAdjacent], backgroundColor: bg }}>{inner}</GameSquare> :
                <Gamebutton onClick={handleClick} onContextMenu={handleRight}>{squareval}</Gamebutton>
            }
        </>

    )
}
export default Squares