var game;
// set height/ width bounds
var minHeight = 5;
var maxHeight = 30;
var minWidth = 5;
var maxWidth = 30;
// adjust game settings for vertical screens
const phone = window.matchMedia("(max-width: 850px)");
if (phone.matches) {
    maxHeight = 60;
    maxWidth = 12;
}
// apply bounds to game settings
document.getElementById("width").max = maxWidth;
document.getElementById("height").max = maxHeight;
// create object to equate string value of difficulty to numerical value
const difficultyNum = {
    easy: 10,
    medium: 5,
    hard: 3
};
// create a library of alert messages
const alerts = {
    heightNAN: "Invalid Height selected",
    heightLow: `Height too Low, minimum Height is ${minHeight}`,
    heightHi: `Height too high, minimum Height is ${maxHeight}`,
    widthNAN: "Invalid Width selected",
    widthLow: `Width too Low, minimum Width is ${minWidth}`,
    widthHi: `Width too high, minimum Width is ${maxWidth}`,
    difInvalid: "invalid difficulty selected",
    Win: "Congratulations!!!! YOU WIN!!!! play again?",
    lose: "you lose, try again?"
};

class GameBoard {
    // static method for invalidating bad inputs
    static inValidate(h, w, d) {
        let res = "";
        switch (true) {
            case h > maxHeight: {
                res += `${alerts.heightHi}\n`;
                break;
            }
            case h < minHeight: {
                res += `${alerts.heightLow}\n`;
                break;
            }
            case isNaN(h): {
                res += `${alerts.heightNAN}\n`;
                break;
            }
            default: {
                break;
            }
        }
        switch (true) {
            case w > maxWidth: {
                res += `${alerts.widthHi}\n`;
                break;
            }
            case w < minWidth: {
                res += `${alerts.widthLow}\n`;
                break;
            }
            case isNaN(w): {
                res += `${alerts.widthNAN}\n`;
                break;
            }
            default: {
                break;
            }
        }
        switch (false) {
            case d in difficultyNum: {
                res += `${alerts.difInvalid}\n`;
                break;
            }
            default: {
                break;
            }
        }
        if (res == "") {
            return false;
        }
        return res;
    }
    constructor(height, width, difficultyString) {
        this.height = height;
        this.width = width;
        this.totalSquares = height * width;
        this.difficulty = difficultyNum[difficultyString];
        this.bombs = this.calculateBombs(this.totalSquares, this.difficulty);
        this.board = this.bombGrid();
        this.correct = this.totalSquares - this.bombs;
        this.domElement = this.buildDomElement();
        this.squares = [];
        this.domValue = "";
    }
    // to be properly constructed the squares object requires an instance of Gameboard to already exist, seperating Gameboard creation and creation of squares allows this to work properly
    postInstance() {
        this.squares = this.buildSquares();
        this.domValue = this.renderSquares();
        this.render();
    }
    buildDomElement() {
        let element = document.getElementById("game");
        element.style.width = this.width * 2 + "rem";
        element.style.height = this.height * 2 + "rem";
        return element;
    }
    //  method for defining bomb quantity as a ratio of board size and difficulty
    calculateBombs() {
        return Math.ceil(this.totalSquares / this.difficulty);
    }
    //  method for building an array which will ultimately be used to render the board
    bombGrid() {
        let board = new Array(this.totalSquares).fill(0);
        //placing bombs in the first (bombs) number of squares
        for (let i = 0; i < this.bombs; i++) {
            board[i] = 1;
        }
        let j = board.length,
            k,
            temp;
        // using fisher-yates-shuffle to randomize the board
        while (--j > 0) {
            k = Math.floor(Math.random() * (j + 1));
            temp = board[k];
            board[k] = board[j];
            board[j] = temp;
        }
        return board;
    }
    buildSquares() {
        let arr = [];
        this.board.forEach((isBomb, index) => {
            arr.push(new Square(index, isBomb));
        });
        return arr;
    }
    renderSquares() {
        let element = "";
        this.squares.forEach((square) => {
            element += square.str;
        });
        return element;
    }
    render() {
        this.domElement.innerHTML = this.domValue;
    }
    removeclick() {
        this.domElement.style.pointerEvents = "none";
    }
}

class Square {
    static used = [];
    static flagged = [];
    static bombs = [];
    constructor(index, bomb) {
        this.index = index;
        this.isBomb = this.isItBomb(bomb);
        this.bg = "";
        this.symbol = "";
        this.adjacentIndexes = this.getAdjacents();
        this.str = this.buildString();
        this.domElement = "";
        this.textColors = [
            "#ffffff",
            "#fbff00",
            "#88ff00",
            "#00ffaa",
            "#00a2ff",
            "#0004ff",
            "#7700ff",
            "#f700ff",
            "#ff0000"
        ];
    }
    buildString() {
        return `
        <button
        class=" btn btn-outline-dark square"
        style="background-color:${this.bg};
        padding:0"
        id="square${this.index}"
        oncontextmenu ="right(${this.index}); return false"
        onmous
        onclick="hit(${this.index})">
        ${this.symbol}
        </button>`;
    }
    isItBomb(bomb) {
        if (bomb == 1) {
            Square.bombs.push(this.index);
        }
        return bomb;
    }
    getDom() {
        this.domElement = document.getElementById(`square${this.index}`);
    }
    // seperate methods for rendering (p Render renders squares which are clicked down and enclosed in a P tag)
    pRender() {
        this.getDom();
        this.domElement.outerHTML = this.str;
    }
    // BTN Render renders squares which are still buttons
    BtnRender() {
        this.getDom();
        this.buildString();
        this.domElement.outerHTML = this.buildString();
    }
    right() {
        switch (this.symbol) {
            case "🚩":
                this.symbol = "?";
                break;
            case "?":
                this.symbol = "";
                Square.flagged.splice(Square.flagged.indexOf(this.index), 1);
                break;
            default:
                this.symbol = "🚩";
                Square.flagged.push(this.index);
                break;
        }
        this.BtnRender();
    }
    check() {
        // stop hit if in a blocked array
        if (this.noclick()) {
            return;
        }
        // if bomb pass to bombHit method
        if (this.isBomb == 1) {
            this.bombHit();
        }
        // otherwise pass to squareHit
        else {
            this.squareHit();
        }
        // P Render this square
        this.pRender();
        // check win condition
        if (Square.used.length == game.correct) {
            newGame(true);
        }
    }
    noclick() {
        /*(although a player can't click on a used square, 
            the loop of programatically clicking through adjacent squares on a 0, creates an issue, 
            since the same square is often loaded into the que for the click method to be called multiple times,
            checking for a used square before a click makes sure the game doesn't end early. 
            with a time complexity of O(N) and a maximum N value of 810 per call this feels like an acceptable tradeoff.*/
        if (Square.used.includes(this.index)) {
            return true;
        }
        // stops player from clicking square with a flag or question mark
        if (Square.flagged.includes(this.index)) {
            return true;
        }
        return false;
    }
    bombHit() {
        {
            this.str = `<p class="clickeddown" style="background-color:white" >💣</p>`;
            let otherBombs = Square.bombs;
            console.log(Square.bombs);

            otherBombs.splice(otherBombs.indexOf(this.index), 1);
            otherBombs.forEach((bomb) => {
                console.log("bomb");
                game.squares[bomb].bg = "red";
                game.squares[bomb].symbol = "💣";
                game.squares[bomb].BtnRender();
            });
            game.removeclick();
            newGame(false);
        }
    }
    squareHit() {
        Square.used.push(this.index);
        let adjacentNum = this.getTotalAdjacent();
        this.str = `<p class="clickeddown" style="color:${this.textColors[adjacentNum]}">${adjacentNum}</p>`;
        if (adjacentNum == 0) {
            for (var key in this.adjacentIndexes) {
                if (this.adjacentIndexes.hasOwnProperty(key)) {
                    game.squares[this.adjacentIndexes[key]].check();
                }
            }
        }
    }
    clickadjacents() {
        for (var key in this.adjacentIndexes) {
            if (this.adjacentIndexes.hasOwnProperty(key)) {
                game.squares[this.adjacentIndexes[key]].check();
            }
        }
    }
    getTotalAdjacent() {
        let totalAdjacent = 0;
        for (var key in this.adjacentIndexes) {
            if (this.adjacentIndexes.hasOwnProperty(key)) {
                totalAdjacent += game.squares[this.adjacentIndexes[key]].isBomb;
            }
        }
        return totalAdjacent;
    }
    getAdjacents() {
        let adjacents = {
            topLeft: this.index - game.width - 1,
            top: this.index - game.width,
            topRight: this.index - game.width + 1,
            left: this.index - 1,
            right: this.index + 1,
            bottomLeft: this.index + game.width - 1,
            bottom: this.index + game.width,
            bottomRight: this.index + game.width + 1
        };
        let deleteArr = [];
        // if the square is on the first line, all squares above it will be out of scope and should be removed
        if (this.index < game.width) {
            deleteArr.push("topLeft", "top", "topRight");
        }
        // if the square is on the last line, all squares below it will be out of scope and should be removed
        if (this.index >= game.width * (game.height - 1)) {
            deleteArr.push("bottomLeft", "bottom", "bottomRight");
        }
        // if the square is on the first column all the left hand squares should be removed
        if (this.index % game.width == 0) {
            deleteArr.push("topLeft", "left", "bottomLeft");
        }
        // if the square is on the last column all the right hand squares should be removed
        if ((this.index + 1) % game.width == 0) {
            deleteArr.push("topRight", "right", "bottomRight");
        }
        // filter out all keys from adjacents that were added to our filtering array
        deleteArr.forEach((location) => {
            delete adjacents[location];
        });
        return adjacents;
    }
}

const start = () => {
    const difficultyInput = document.getElementById("difficulty").value;
    const heightInput = parseInt(document.getElementById("height").value);
    const widthInput = parseInt(document.getElementById("width").value);
    let inValidation = GameBoard.inValidate(
        heightInput,
        widthInput,
        difficultyInput
    );
    if (inValidation) {
        alert(inValidation);
        return;
    }
    document.getElementById("entry").innerHTML = `
    <button
    class=" btn btn-outline-dark square"
    style="background-color:green;width: 10rem;height:5rem"
    onclick="entrypoint()">
    click me to reveal a zero area
    </button>`;
    document.getElementById("instructions").innerHTML =
        "click a square to check for bombs</br>the number shown is the total bombs encircling the number</br>right click a square to flag it (on mobile, long press instead of right click)</br>";
    Square.bombs = [];
    Square.used = [];
    Square.flagged = [];
    game = new GameBoard(heightInput, widthInput, difficultyInput);
    game.postInstance();
    game.domElement.style.pointerEvents = "auto";
};
const hit = (index) => {
    let square = game.squares[index];
    // square.domElement = document.getElementById(`square${index}`)
    square.check();
};
const right = (index) => {
    let square = game.squares[index];
    square.right();
};
const delay = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
};

const newGame = (result) => {
    let message = alerts.lose;

    if (result) {
        message = alerts.Win;
    }
    // show confirmation box with message, run start function if player confirms
    delay(100).then(() => {
        if (confirm(message)) {
            start();
        } else {
            return;
        }
    });
};
const entrypoint = () => {
    for (let i = 0; i < game.squares.length; i++) {
        if (
            game.squares[i].getTotalAdjacent() === 0 &&
            game.squares[i].isBomb == 0 &&
            !Square.used.includes(i)
        ) {
            game.squares[i].check();
            return;
        }
    }
};
