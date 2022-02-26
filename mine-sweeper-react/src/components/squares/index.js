import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Gamebutton } from './squaresElements'

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
    const [squareval, setSquareVal] = useState("")
    const handleClick = (e) => {
        e.preventDefault();
        console.log("left")
    }
    const handleRight = (e) => {
        e.preventDefault();
        switch (squareval) {
            case "🚩":
                setSquareVal("?")
                break;
            case "?":
                setSquareVal("")
                break;
            default:
                setSquareVal("🚩")
                break;

        }
        console.log("right")
    }
    return (
        <Gamebutton onClick={handleClick} onContextMenu={handleRight}>{squareval}</Gamebutton>
    )
}
export default Squares