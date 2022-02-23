var game;
// set height/ width bounds
const minHeight = 5;
const maxHeight = 30;
const minWidth = 5;
const maxWidth = 30;
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
            this.domValue = this.renderSquares()
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
            console.log(isBomb)
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
}

class Square {
    static used = [];
    static flagged = [];
    static bombs = []
    constructor(index, bomb) {
        this.isBomb = bomb;
        this.index = index;
        this.symbol = ""
        this.str = `<button class="square btn btn-outline-dark" id="square${index}" oncontextmenu ="right(${index}); return false" onclick="hit(${index})">${this.symbol}</button>`
        this.domElement = ""
    }
    getDom() {
        this.domElement = document.getElementById(`square${this.index}`)
    }
    reRender() {
        this.domElement.outerHTML = this.str
    }
    right() {
        this.getDom()
        switch (this.symbol) {
            case "🚩":
                this.symbol = "?"
                break;
            case "?":
                this.symbol = "";
                Square.flagged.splice(Square.flagged.indexOf(index), 1)
            default:
                this.symbol = "🚩"
                Square.flagged.push(this.index)
                break;
        }
    }
    check() {
        this.getDom()
        if (this.isBomb == 1) {
            this.str = `<p class="clickeddown" >bom</p>`
        }
        else {
            this.str = `<p class="clickeddown">1</p>`
        }
        this.reRender()
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
    game = new GameBoard(heightInput, widthInput, difficultyInput)
}
const hit = (index) => {
    let square = game.squares[index]
    // square.domElement = document.getElementById(`square${index}`)
    console.log(square)
    square.check()
}