let minH = 5;
let maxH = 30;
let minW = 5;
let maxW = 30;

export const Globals = {
    minHeight: minH,
    maxHeight: maxH,
    minWidth: minW,
    maxWidth: maxW,
    difficultyNum: {
        "easy": 10,
        "medium": 5,
        "hard": 3
    },
    alerts: {
        heightNAN: "Invalid Height selected",
        heightLow: `Height too Low, minimum Height is ${minH}`,
        heightHi: `Height too high, minimum Height is ${maxH}`,
        widthNAN: "Invalid Width selected",
        widthLow: `Width too Low, minimum Width is ${minW}`,
        widthHi: `Width too high, minimum Width is ${maxW}`,
        difInvalid: 'invalid difficulty selected',
        Win: "Congratulations!!!! YOU WIN!!!! play again?",
        lose: "you lose, try again?"
    }

}