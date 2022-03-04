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