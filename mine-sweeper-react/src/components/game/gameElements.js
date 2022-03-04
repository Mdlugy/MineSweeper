import styled from "styled-components";

export const Board = styled.div`
background-color: #5f7577;
display:flex;
flex-wrap:wrap;
width:${props => props.game.width * 1.5}em;`

