import styled from "styled-components";

export const Board = styled.div`display:flex; flex-wrap:wrap;
width:${props => props.game.width * 1.5}rem;`

export const Gamebutton = styled.button`
min-width: 1.5rem;min-height:1.5rem;
`