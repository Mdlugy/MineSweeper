class GameBoard {
    constructor(height, width, difficultyString) {
        this.height = height,
            this.width = width,
            this.totalSquares = height * width,
            this.difficulty = GameBoard.difficultyDiv(difficultyString),
            this.bombs = GameBoard.calculateBombs(this.totalSquares, this.difficulty),
            this.board = GameBoard.bombGrid(this.totalSquares, this.bombs),
            this.correct = this.totalSquares - this.bombs,
            this.used = [],
            this.flagged = []
    }
    static difficultyDiv(difficulty) {
        let difficultyNum = {
            "easy": 10,
            "medium": 5,
            "hard": 3
        }
        return difficultyNum[difficulty]
    }
    static calculateBombs(totalSquares, difficulty) {
        return Math.ceil(totalSquares / difficulty)
    }
    static bombGrid(totalSquares, bombs) {
        let board = new Array(totalSquares).fill(0);
        //placing bombs in the first (bombs) number of squares
        for (let i = 0; i < bombs; i++) {
            board[i] = 1
        }
        let j = board.length, k, temp;
        // using fisher-yates-shuffle to randomize the board
        while (--j > 0) {
            k = Math.floor(Math.random() * (j + 1));
            temp = board[k];
            board[k] = board[j]
            board[j] = temp;
        }
        return board
    }
    renderBoard() {
        // mapping function over squares
        return "renderBoard"
    }
}

class squares {
    static content(isBomb) {
        let squareClass;
        if (isBomb) { squareClass = bombSquare }
        else { squareClass = emptySquare }
    }
    constructor(index) {
        this.index = index
        this.symbol = ""
    }
    right() {
        switch (this.symbol) {
            case "🚩":
                this.symbol = "?"
                break;
            case "?":
                this.symbol = "";
                GameBoard.flagged.splice(game.flagged.indexOf(i), 1)
            default:
                this.symbol = "🚩"
                GameBoard.flagged.push(this.index)
                break;
        }
    }
}
class bombSquare extends squares {
    static bombLocations = []
    constructor() {
        bombSquare.bombLocations.push(this.index)
    }
    hit() {

        lost = true
        // make the bomb the player lost on red


        // element.style.backgroundColor = "red";
        // element.innerHTML = "💣"


        // show all other bombs on the board
        for (let i = 0; i < boardArr.length; i++) {
            if (pos == i) { continue }
            else if (boardArr[i] == 1) {
                document.getElementById(`square${i}`).innerHTML = "💣"
                continue
            }
        }
    }
class emptySquare extends squares {
    click() { }

    getUnusedAdjacent() {
        pos = this.index
        // define which cells could be included in the local array
        let resultArr = [pos - width - 1, pos - width, pos - width + 1, pos - 1, pos + 1, pos + width - 1, pos + width, pos + width + 1]
        // inititallize an array for filtering
        let removeArr = []
        // if the square is on the first line, all squares above it (pos-width) will be out of scope and should be removed
        if (pos < width) {
            removeArr.push(0, 1, 2)
        }
        // if the square is on the last line, all squares below it (pos+width) will be out of scope and should be removed
        if (pos >= width * (height - 1)) {
            removeArr.push(5, 6, 7)
        }
        // if the square is on the first column all the left hand squares (-1) should be removed
        if (pos % width == 0) {
            removeArr.push(0, 3, 5)
        }
        // if the square is on the last column all the right hand squares (+1) should be removed
        if ((pos + 1) % width == 0) {
            removeArr.push(2, 4, 7)
        }
        // remove duplicates in the filter array
        removeArr = [...new Set(removeArr)]
        // remove all indexes from resultArr which are listed in the filtering Array
        for (let i = removeArr.length - 1; i >= 0; i--) {
            resultArr.splice(removeArr[i], 1)
        }

        // filter for previously clicked squares
        for (let j = resultArr.length - 1; j >= 0; j--) {
            if (used.includes(resultArr[j])) {
                resultArr.splice(j, 1)

            }
        }
        return resultArr;

    }

}

const start = () => {

    // pull values from game settings menu
    height = parseInt(document.getElementById('height').value)
    if (height > 30) {
        alert("max board height is 30")
        height = 30
        document.getElementById('height').value = 30
    }
    if (isNaN(height) || height < 5) {
        alert("min board height is 5")
        height = 5
        document.getElementById('height').value = 5
    }
    width = parseInt(document.getElementById('width').value)
    // validate
    if (width > 24) {
        alert("max board width is 24")
        width = 24
        document.getElementById('width').value = 24
    }
    if (isNaN(width) || width < 5) {
        alert("min board width is 5")
        width = 5
        document.getElementById('width').value = 5
        document.getElementById('difficulty').value = "easy"
    }
    let difficulty = document.getElementById("difficulty").value
    let difficulties = ["easy", "medium", "hard"]

    // validate against improper input
    if (!difficulties.includes(difficulty)) {
        alert("you didn't select a valid difficulty");
        return;
    }
    let game = new GameBoard(height, width, difficulty)

    // validate against bad inputs

    // set difficulty number based on input

    // apply correct size to game board
    document.getElementById("game").style.width = width * 2 + "rem"
    document.getElementById("game").style.height = height * 2 + "rem"
    boardDiv.innerHTML = render()

};

const place = (total) => {
    //placing bombs in the first (bombs) number of squares
    for (let k = 0; k < total; k++) {
        boardArr[k] = 1
    }
    // using fisher-yates-shuffle to randomize the board
    let i = boardArr.length, j, temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = boardArr[j];
        boardArr[j] = boardArr[i]
        boardArr[i] = temp;
    }
    // initially I used random indexes of the array and recursively ran through this function on duplicates, but this was causing recursion depth errors on the hard difficulty
}

const render = () => {
    // render as a table
    let result = "<table>"
    for (let i = 0; i < (height * width); i++) {
        if (i % width == 0) {
            // if the position is evenly divisible by the width the square is the beginning of a new row append opening row tag
            result += "<tr>"
        }
        // append to the result a td square containting a button marked by the position as the id and containg calls to game functions
        // a left click will call the "hit" function a right click will override the default behavior of opening a context menu and call the "right" function
        result += `<td><button class="square" id=square${i} oncontextmenu =  "right( ${i}, this); return false" " onclick="hit( ${i}, this)"></button></td>`;
        if (i % width + 1 == 0) {
            // if the position +1 is evenly divisible by the width the square is the end of a the row, append closing row tag
            result += "</tr>"
        }
    }
    // append closing table tag 
    result += "</table>"
    return result
}






const hit = (pos, element) => {
    // disable click on lost game
    if (lost) { return }
    // sanitize function calls. this is necessary because of some quirks in the recurrsion process called at the end of this function as well as checking for flag or question mark on square
    if (pos < 0 || pos >= (width * height) || used.includes(pos) || flagged.includes(pos)) { return }
    // if if pos is a mine location call "lose function"
    if (boardArr[pos] == 1) {
        lose(pos, element)
        return;
    }
    // create a local variable to count adjacent bombs
    let totalAdjacent = 0
    // add the current position into the used Arr
    used.push(pos)
    // decrement correct, correct reaching 0 is a win condition
    correct--
    // create an array of adjacent cells to be tested
    let testArr = getUnusedAdjacent(pos)
    // add all bombs in adjacent cells to total Adjacent
    for (let i = 0; i < testArr.length; i++) {
        if (boardArr[testArr[i]] == 1) {
            totalAdjacent++;
        }
    }
    //edit the element in the dom to show that it's been succesfully clicked 
    element.classList.add("clickeddown");
    element.classList.remove("square");
    element.innerHTML = totalAdjacent
    // check for win condition
    if (correct == 0) { newGame(true) }

    // if the resulting square has no local bombs, send each of the local cluster of squares through this function recursively. 
    // This creates the effect of automatically solving large sections of the board when a player hits a 0

    if (totalAdjacent == 0) {
        for (let j = 0; j < testArr.length; j++) {
            hit(testArr[j], document.getElementById(`square${testArr[j]}`))
        }
    }


}

const getUnusedAdjacent = (pos) => {
    // define which cells could be included in the local array
    let resultArr = [pos - width - 1, pos - width, pos - width + 1, pos - 1, pos + 1, pos + width - 1, pos + width, pos + width + 1]
    // inititallize an array for filtering
    let removeArr = []
    // if the square is on the first line, all squares above it (pos-width) will be out of scope and should be removed
    if (pos < width) {
        removeArr.push(0, 1, 2)
    }
    // if the square is on the last line, all squares below it (pos+width) will be out of scope and should be removed
    if (pos >= width * (height - 1)) {
        removeArr.push(5, 6, 7)
    }
    // if the square is on the first column all the left hand squares (-1) should be removed
    if (pos % width == 0) {
        removeArr.push(0, 3, 5)
    }
    // if the square is on the last column all the right hand squares (+1) should be removed
    if ((pos + 1) % width == 0) {
        removeArr.push(2, 4, 7)
    }
    // remove duplicates in the filter array
    removeArr = [...new Set(removeArr)]
    // remove all indexes from resultArr which are listed in the filtering Array
    for (let i = removeArr.length - 1; i >= 0; i--) {
        resultArr.splice(removeArr[i], 1)
    }

    // filter for previously clicked squares
    for (let j = resultArr.length - 1; j >= 0; j--) {
        if (used.includes(resultArr[j])) {
            resultArr.splice(j, 1)

        }
    }
    return resultArr;

}


const right = (i, element) => {
    // disable right click on loss
    if (lost) { return }
    // cycle through 3 possible states flag for definite bomb, ? for possible bomb, "" for no bomb
    if (element.innerHTML == "") { element.innerHTML = "🚩"; flagged.push(i); }
    else if (element.innerHTML == "🚩") { element.innerHTML = "?"; }
    else if (element.innerHTML == "?") { element.innerHTML = ""; flagged.splice(flagged.indexOf(i), 1); }
}


const lose = (pos, element) => {
    // set game to lost
    lost = true
    // make the bomb the player lost on red
    element.style.backgroundColor = "red";
    element.innerHTML = "💣"
    // show all other bombs on the board
    for (let i = 0; i < boardArr.length; i++) {
        if (pos == i) { continue }
        else if (boardArr[i] == 1) {
            document.getElementById(`square${i}`).innerHTML = "💣"
            continue
        }
    }
    // new game confirmation with lose message
    newGame(false)
}
const newGame = (result) => {
    let message;
    if (!result) {
        message = "You lost :( would you like to play again?"
    }
    if (result) {
        message = "YOU WIN!!!!!! would you like to play again?"
    }
    // show confirmation box with message, run start function if player confirms
    delay(100).then(() => {
        if (confirm(message)) { start() }
        else { return }
    })
}
const delay = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}
