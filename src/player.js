import Dom from "./dom.js";
import GameBoard from "./gameboard.js";

class Player {
    constructor(type, board) {
        this.type = type;
        this.board = board;
        this.random = [] //for testing
    }

    placeShip(ship, coord = null) {
        const player = this;
        if (coord === null) {
            const randomX = 'ABCDEFGHIJ'.split("")[Math.floor(Math.random() * 10)];
            const randomY = Math.floor(Math.random() * 10);
            const randomCoord = { x: randomX, y: randomY };
            
            this.random.push(randomCoord);
            this.board.placeShip(player,randomCoord, ship);
        } else {
            this.board.placeShip(player,coord, ship);
        }
    }

    attack(opponentPlayer, coord = null) {
        if (coord === null) {
            const randomX = 'ABCDEFGHIJ'.split("")[Math.floor(Math.random() * 10)];
            const randomY = Math.floor(Math.random() * 10);
            const randomCoord = { x: randomX, y: randomY };

            this.random.push(randomCoord);//for testing
            opponentPlayer.board.reciveAttack(opponentPlayer, randomCoord);
        } else {
            this.random.push(coord);//for testing
            opponentPlayer.board.reciveAttack(opponentPlayer, coord);
        }
    }
}

export default Player;