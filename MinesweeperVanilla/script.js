var game;



// set height/ width bounds
var minHeight = 5;
var maxHeight = 30;
var minWidth = 5;
var maxWidth = 31;

const phone = window.matchMedia("(max-width: 500px)")
if (phone.matches) {
    maxHeight = 60;
    maxWidth = 12;
}


document.getElementById("width").max = maxWidth
document.getElementById("height").max = maxHeight

// create object to equate string value of difficulty to numerical value
const difficultyNum = {
    "easy": 10,
    "medium": 5,
    "hard": 3
}
// create a library of alert messages
const alerts = {
    heightNAN: "Invalid Height selected",
    heightLow: `Height too Low, minimum Height is ${minHeight}`,
    heightHi: `Height too high, minimum Height is ${maxHeight}`,
    widthNAN: "Invalid Width selected",
    widthLow: `Width too Low, minimum Width is ${minWidth}`,
    widthHi: `Width too high, minimum Width is ${maxWidth}`,
    difInvalid: 'invalid difficulty selected',
    Win: "Congratulations!!!! YOU WIN!!!! play again?",
    lose: "you lose, try again?"
};

class GameBoard {
    // static method for invalidating bad inputs
    static inValidate(h, w, d) {
        let res = ""
        switch (true) {
            case (h > maxHeight): {
                res += `${alerts["heightHi"]}\n`
                break;
            }
            case (h < minHeight): {
                res += `${alerts["heightLow"]}\n`
                break;
            }
            case (isNaN(h)): {
                res += `${alerts["heightNAN"]}\n`
                break;
            }
            default: { break; }
        }
        switch (true) {
            case (w > maxWidth): {
                res += `${alerts["widthHi"]}\n`
                break;
            }
            case (w < minWidth): {
                res += `${alerts["widthLow"]}\n`
                break;
            }
            case (isNaN(w)): {
                res += `${alerts["widthNAN"]}\n`
                break;
            }
            default: { break; }
        }
        switch (false) {
            case (d in difficultyNum): {
                res += `${alerts["difInvalid"]}\n`
                break;
            }
            default: { break; }
        }
        if (res == '') { return false }
        return res
    }
    constructor(height, width, difficultyString) {
        this.height = height,
            this.width = width,
            this.totalSquares = (height * width),
            this.difficulty = difficultyNum[difficultyString],
            this.bombs = this.calculateBombs(this.totalSquares, this.difficulty),
            this.board = this.bombGrid(),
            this.correct = this.totalSquares - this.bombs,
            this.domElement = this.buildDomElement(),
            this.squares = this.buildSquares(),
            this.domValue = this.renderSquares(),
            this.render()
    }
    buildDomElement() {
        let element = document.getElementById('game')
        element.style.width = this.width * 2 + "rem"
        element.style.height = this.height * 2 + "rem"

        return element

    }
    //  method for defining bomb quantity as a ratio of board size and difficulty
    calculateBombs() {
        return Math.ceil(this.totalSquares / this.difficulty)
    }
    //  method for building an array which will ultimately be used to render the board
    bombGrid() {
        let board = new Array(this.totalSquares).fill(0);
        //placing bombs in the first (bombs) number of squares
        for (let i = 0; i < this.bombs; i++) {
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
    buildSquares() {
        let arr = []
        this.board.forEach((isBomb, index) => {
            arr.push(new Square(index, isBomb))
        })
        return arr
    }
    renderSquares() {
        let element = ""
        this.squares.forEach((square) => {
            element += square.str
        })
        return element
    }
    render() {
        this.domElement.innerHTML = this.domValue
    }
    removeclick() {
        this.domElement.style.pointerEvents = 'none'
    }
}

class Square {
    static used = [];
    static flagged = [];
    static bombs = []
    constructor(index, bomb) {
        this.index = index;
        this.isBomb = this.isItBomb(bomb)
        this.bg = ""
        this.symbol = ""
        this.str = this.buildString()
        this.domElement = ""
    }
    buildString() {
        return `<button class=" btn btn-outline-dark square" style="background-color:${this.bg}; padding:0"id="square${this.index}" oncontextmenu ="right(${this.index}); return false" onclick="hit(${this.index})">${this.symbol}</button>`
    }
    isItBomb(bomb) {
        if (bomb == 1) {
            Square.bombs.push(this.index)
        }
        return bomb
    }
    getDom() {
        this.domElement = document.getElementById(`square${this.index}`)
    }
    pRender() {
        this.getDom()
        this.domElement.outerHTML = this.str

    }
    BtnRender() {
        this.getDom()
        this.buildString()
        this.domElement.outerHTML = this.buildString()
    }
    right() {
        switch (this.symbol) {
            case "🚩":
                this.symbol = "?"
                break;
            case "?":
                this.symbol = "";
                Square.flagged.splice(Square.flagged.indexOf(this.index), 1)
                break;
            default:
                this.symbol = "🚩"
                Square.flagged.push(this.index)
                break;
        }
        this.BtnRender()
    }
    noclick() {
        if (Square.used.includes(this.index)) { return true }
        if (Square.flagged.includes(this.index)) { return true }
        return false
    }
    check() {
        if (this.noclick()) { return }
        if (this.isBomb == 1) {
            this.str = `<p class="clickeddown" style="background-color:white" >💣</p>`
            let otherBombs = Square.bombs
            otherBombs.splice(otherBombs.indexOf(this.index), 1)
            otherBombs.forEach((bomb) => {
                game.squares[bomb].bg = "red";
                game.squares[bomb].symbol = "💣";
                game.squares[bomb].BtnRender()
            })
            game.removeclick()
            newGame(false)
        }
        else {
            Square.used.push(this.index)
            let adjacents = this.getAdjacents()
            let totalAdjacent = 0
            for (var key in adjacents) {
                if (adjacents.hasOwnProperty(key)) {
                    totalAdjacent += game.squares[adjacents[key]].isBomb
                }
            }
            this.str = `<p class="clickeddown">${totalAdjacent}</p>`
            if (totalAdjacent == 0) {
                for (var key in adjacents) {
                    if (adjacents.hasOwnProperty(key)) {
                        game.squares[adjacents[key]].check()
                    }
                }
            }
        }
        this.pRender()
        if (Square.used.length == game.correct) { newGame(true) }
    }
    getAdjacents() {
        // let pos = this.index;
        // let width = game.width
        // let height = game.height
        let adjacents = {
            topLeft: (this.index - game.width - 1),
            top: (this.index - game.width),
            topRight: (this.index - game.width + 1),
            left: (this.index - 1),
            right: (this.index + 1),
            bottomLeft: (this.index + game.width - 1),
            bottom: (this.index + game.width),
            bottomRight: (this.index + game.width + 1),
        }
        let deleteArr = []
        // if the square is on the first line, all squares above it will be out of scope and should be removed
        if (this.index < game.width) {
            deleteArr.push("topLeft", "top", "topRight")
        }
        // if the square is on the last line, all squares below it will be out of scope and should be removed
        if (this.index >= game.width * (game.height - 1)) {
            deleteArr.push("bottomLeft", "bottom", "bottomRight")
        }
        // if the square is on the first column all the left hand squares should be removed
        if (this.index % game.width == 0) {
            deleteArr.push("topLeft", "left", "bottomLeft")
        }
        // if the square is on the last column all the right hand squares should be removed
        if ((this.index + 1) % game.width == 0) {
            deleteArr.push("topRight", "right", "bottomRight")
        }
        // filter out all keys from adjacents that were added to our filtering array
        deleteArr.forEach((location) => {
            delete adjacents[location]
        })
        return adjacents
    }
}


const start = () => {
    const difficultyInput = document.getElementById("difficulty").value;
    const heightInput = parseInt(document.getElementById("height").value);
    const widthInput = parseInt(document.getElementById("width").value);
    let inValidation = GameBoard.inValidate(heightInput, widthInput, difficultyInput)
    if (inValidation) {
        alert(inValidation)
        return;
    }
    Square.bombs = []
    Square.used = []
    Square.flagged = []
    game = new GameBoard(heightInput, widthInput, difficultyInput)
    game.domElement.style.pointerEvents = 'auto'
}
const hit = (index) => {
    let square = game.squares[index]
    // square.domElement = document.getElementById(`square${index}`)
    square.check()
}
const right = (index) => {
    let square = game.squares[index]
    square.right()
}
const delay = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}

const newGame = (result) => {
    let message = alerts["lose"]

    if (result) {
        message = alerts["Win"]
    }
    // show confirmation box with message, run start function if player confirms
    delay(100).then(() => {
        if (confirm(message)) { start() }
        else { return }
    })
}