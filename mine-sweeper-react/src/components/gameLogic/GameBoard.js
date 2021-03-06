import { Globals } from "./Globals";
import Square from './Square'
export default class GameBoard {
    // static method for invalidating bad inputs
    static inValidate(h, w, d) {
        let res = ""
        switch (true) {
            case (h > Globals.maxHeight): {
                res += `${Globals.alerts["heightHi"]}\n`
                break;
            }
            case (h < Globals.minHeight): {
                res += `${Globals.alerts["heightLow"]}\n`
                break;
            }
            case (isNaN(h)): {
                res += `${Globals.alerts["heightNAN"]}\n`
                break;
            }
            default: { break; }
        }
        switch (true) {
            case (w > Globals.maxWidth): {
                res += `${Globals.alerts["widthHi"]}\n`
                break;
            }
            case (w < Globals.minWidth): {
                res += `${Globals.alerts["widthLow"]}\n`
                break;
            }
            case (isNaN(w)): {
                res += `${Globals.alerts["widthNAN"]}\n`
                break;
            }
            default: { break; }
        }
        switch (false) {
            case (d in Globals.difficultyNum): {
                res += `${Globals.alerts["difInvalid"]}\n`
                break;
            }
            default: { break; }
        }
        if (res === '') { return false }
        return res
    }
    constructor(height, width, difficultyString) {
        this.height = height;
        this.width = width;
        this.totalSquares = (height * width);
        this.difficulty = Globals.difficultyNum[difficultyString];
        this.bombs = this.calculateBombs();
        this.correct = this.totalSquares - this.bombs;
        this.board = this.bombGrid();
        this.squares = [];
    }

    toString() { return `height ${this.height} width ${this.width} difficultyNum ${this.difficulty} bombs ${this.bombs}` }

    // //  method for defining bomb quantity as a ratio of board size and difficulty
    calculateBombs() {
        return Math.ceil(this.totalSquares / this.difficulty)
    }
    // //  method for building an array which will ultimately be used to render the board
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
        if (this.squares.length === this.board.length) { return }
        // can't find the place in my codebase that's causing this issue, but without this blocking statement buildSquares fires twice. will try to resolve this issue, but leaving in a blocking statement for now. 
        this.board.forEach((isBomb, index) => {
            this.squares.push(new Square(index, isBomb))
        })
    }
}
