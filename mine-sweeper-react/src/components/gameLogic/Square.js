export default class Square {
    static bombs = [];
    static used = [];
    static flagged = [];
    constructor(index, bomb) {
        this.index = index;
        this.clicked = false;
        this.bomb = this.getBomb(bomb);
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
        this.adjacentIndexes = null
        this.totalAdjacent = null

    }
    init(game) {
        this.game = game
        this.adjacentIndexes = this.getAdjacents(this.game);
        this.totalAdjacent = this.getTotalAdjacent(this.game)

    }
    noClick() {
        if (Square.used.includes(this.index) || Square.flagged.includes(this.index)) { return true }
    }
    getBomb(bomb) {
        Square.bombs.push(this.index);
        return bomb
    }

    click() {
        if (this.noClick()) { return }
        Square.used.push(this.index);
        if (this.totalAdjacent === 0) {
            for (const [key, value] of Object.entries(this.adjacentIndexes)) {
                this.game.squares[value].click()
            }
        }
        this.clicked = true
    }
    getAdjacents(game) {
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
        if (this.index % game.width === 0) {
            deleteArr.push("topLeft", "left", "bottomLeft");
        }
        // if the square is on the last column all the right hand squares should be removed
        if ((this.index + 1) % game.width === 0) {
            deleteArr.push("topRight", "right", "bottomRight");
        }
        // filter out all keys from adjacents that were added to our filtering array
        deleteArr.forEach((location) => {
            delete adjacents[location];
        });
        return adjacents;
    }
    getTotalAdjacent(game) {
        let totalAdjacent = 0;
        for (var key in this.adjacentIndexes) {
            if (this.adjacentIndexes.hasOwnProperty(key)) {
                totalAdjacent += game.squares[this.adjacentIndexes[key]].bomb;
            }
        }
        return totalAdjacent;
    }
}



// static used = [];
//     static flagged = [];
//     static bombs = [];
//     constructor(index, bomb) {
//         this.index = index;
//         this.isBomb = this.isItBomb(bomb);
//         this.bg = "";
//         this.symbol = "";
//         this.adjacentIndexes = this.getAdjacents();
//         this.str = this.buildString();
//         this.domElement = "";
//         this.textColors = [
//             "#ffffff",
//             "#fbff00",
//             "#88ff00",
//             "#00ffaa",
//             "#00a2ff",
//             "#0004ff",
//             "#7700ff",
//             "#f700ff",
//             "#ff0000"
//         ];
//     }
//     buildString() {
//         return `
//         <button
//         class=" btn btn-outline-dark square"
//         style="background-color:${this.bg};
//         padding:0"
//         id="square${this.index}"
//         oncontextmenu ="right(${this.index}); return false"
//         onmous
//         onclick="hit(${this.index})">
//         ${this.symbol}
//         </button>`;
//     }
//     isItBomb(bomb) {
//         if (bomb == 1) {
//             Square.bombs.push(this.index);
//         }
//         return bomb;
//     }
//     getDom() {
//         this.domElement = document.getElementById(`square${this.index}`);
//     }
//     // seperate methods for rendering (p Render renders squares which are clicked down and enclosed in a P tag)
//     pRender() {
//         this.getDom();
//         this.domElement.outerHTML = this.str;
//     }
//     // BTN Render renders squares which are still buttons
//     BtnRender() {
//         this.getDom();
//         this.buildString();
//         this.domElement.outerHTML = this.buildString();
//     }
//     right() {
//         switch (this.symbol) {
//             case "🚩":
//                 this.symbol = "?";
//                 break;
//             case "?":
//                 this.symbol = "";
//                 Square.flagged.splice(Square.flagged.indexOf(this.index), 1);
//                 break;
//             default:
//                 this.symbol = "🚩";
//                 Square.flagged.push(this.index);
//                 break;
//         }
//         this.BtnRender();
//     }
//     check() {
//         // stop hit if in a blocked array
//         if (this.noclick()) {
//             return;
//         }
//         // if bomb pass to bombHit method
//         if (this.isBomb == 1) {
//             this.bombHit();
//         }
//         // otherwise pass to squareHit
//         else {
//             this.squareHit();
//         }
//         // P Render this square
//         this.pRender();
//         // check win condition
//         if (Square.used.length == game.correct) {
//             newGame(true);
//         }
//     }
//     noclick() {
//         /*(although a player can't click on a used square,
//             the loop of programatically clicking through adjacent squares on a 0, creates an issue,
//             since the same square is often loaded into the que for the click method to be called multiple times,
//             checking for a used square before a click makes sure the game doesn't end early.
//             with a time complexity of O(N) and a maximum N value of 810 per call this feels like an acceptable tradeoff.*/
//         if (Square.used.includes(this.index)) {
//             return true;
//         }
//         // stops player from clicking square with a flag or question mark
//         if (Square.flagged.includes(this.index)) {
//             return true;
//         }
//         return false;
//     }
//     bombHit() {
//         {
//             this.str = `<p class="clickeddown" style="background-color:white" >💣</p>`;
//             let otherBombs = Square.bombs;

//             otherBombs.splice(otherBombs.indexOf(this.index), 1);
//             otherBombs.forEach((bomb) => {
//                 game.squares[bomb].bg = "red";
//                 game.squares[bomb].symbol = "💣";
//                 game.squares[bomb].BtnRender();
//             });
//             game.removeclick();
//             newGame(false);
//         }
//     }
//     squareHit() {
//         Square.used.push(this.index);
//         let adjacentNum = this.getTotalAdjacent();
//         this.str = `<p class="clickeddown" style="color:${this.textColors[adjacentNum]}">${adjacentNum}</p>`;
//         if (adjacentNum == 0) {
//             for (var key in this.adjacentIndexes) {
//                 if (this.adjacentIndexes.hasOwnProperty(key)) {
//                     game.squares[this.adjacentIndexes[key]].check();
//                 }
//             }
//         }
//     }
//     clickadjacents() {
//         for (var key in this.adjacentIndexes) {
//             if (this.adjacentIndexes.hasOwnProperty(key)) {
//                 game.squares[this.adjacentIndexes[key]].check();
//             }
//         }
//     }
//     getTotalAdjacent() {
//         let totalAdjacent = 0;
//         for (var key in this.adjacentIndexes) {
//             if (this.adjacentIndexes.hasOwnProperty(key)) {
//                 totalAdjacent += game.squares[this.adjacentIndexes[key]].isBomb;
//             }
//         }
//         return totalAdjacent;
//     }
//     getAdjacents() {
//         let adjacents = {
//             topLeft: this.index - game.width - 1,
//             top: this.index - game.width,
//             topRight: this.index - game.width + 1,
//             left: this.index - 1,
//             right: this.index + 1,
//             bottomLeft: this.index + game.width - 1,
//             bottom: this.index + game.width,
//             bottomRight: this.index + game.width + 1
//         };
//         let deleteArr = [];
//         // if the square is on the first line, all squares above it will be out of scope and should be removed
//         if (this.index < game.width) {
//             deleteArr.push("topLeft", "top", "topRight");
//         }
//         // if the square is on the last line, all squares below it will be out of scope and should be removed
//         if (this.index >= game.width * (game.height - 1)) {
//             deleteArr.push("bottomLeft", "bottom", "bottomRight");
//         }
//         // if the square is on the first column all the left hand squares should be removed
//         if (this.index % game.width == 0) {
//             deleteArr.push("topLeft", "left", "bottomLeft");
//         }
//         // if the square is on the last column all the right hand squares should be removed
//         if ((this.index + 1) % game.width == 0) {
//             deleteArr.push("topRight", "right", "bottomRight");
//         }
//         // filter out all keys from adjacents that were added to our filtering array
//         deleteArr.forEach((location) => {
//             delete adjacents[location];
//         });
//         return adjacents;
//     }
// }