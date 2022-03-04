import React, { useEffect } from 'react'
import Square from '../gameLogic/Square'
import { useState } from 'react'
import { Gamebutton, GameSquare } from './squaresElements'
import { Globals } from '../gameLogic/Globals'

const Squares = (props) => {
    props.square.init(props.game);
    const [squareval, setSquareVal] = useState("")
    const [clicked, setClicked] = useState(props.square.clicked)
    const [inner, setInner] = useState(props.square.totalAdjacent)
    const [bg, setbg] = useState("#5f7577")
    const [outerBG, setOuterBG] = useState("aliceblue")

    useEffect(() => {
        // resets square to unclicked when new game object is instantiated
        setClicked(false)
        setbg("#5f7577")
        setInner(props.square.totalAdjacent)
        setSquareVal("")
        Square.flagged = []
        Square.used = []
        props.setLost(false)
        setOuterBG("aliceblue")
        setSquareVal("")


    }, [props.game, props.square.totalAdjacent]);

    useEffect(() => {
        setClicked(props.square.clicked)
    }, [props.check, props.square.clicked])

    useEffect(() => {
        if (props.lost) {
            if (props.square.bomb === 1) {
                setOuterBG("red")
                setSquareVal("💣")
            }
        }
    }, [props.lost])

    const handleClick = (e) => {
        e.preventDefault();
        if (props.square.noClick()) { return }
        if (props.square.bomb === 1) {
            setInner("💣")
            setbg("white")
            setClicked(true)
            props.setLost(true)
            setTimeout(() => {
                if (window.confirm(Globals.alerts.lose)) {
                    props.setStartNew(true)
                }
            }, 100)
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
    // if (props.lost && props.lostSquare !== props.square.index) {
    //     if (props.square.bomb === 1) {
    //         setbg("red")
    //         setInner("💣")
    //     }
    // }

    return (
        <>
            {clicked ?
                <GameSquare style={{ color: props.square.textColors[props.square.totalAdjacent], backgroundColor: bg }}>{inner}</GameSquare> :
                <Gamebutton onClick={handleClick} style={{ backgroundColor: outerBG }} onContextMenu={handleRight}>{squareval}</Gamebutton>
            }
        </>

    )
}
export default Squares