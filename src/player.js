import GameBoard from "./gameboard";

class Player {
    constructor(type) {
        this.type = type;
        this.board = new GameBoard();
        this.random = [] //for testing
    }

    placeShip(ship, coord = null) {
        if(coord === null){
            const randomX = 'ABCDEFGHIJ'.split("")[Math.floor(Math.random() * 10)];
            const randomY = Math.floor(Math.random() * 10);
            const randomCoord = {x: randomX, y: randomY};

            this.random.push(randomCoord);
            this.board.placeShip(randomCoord, ship);
        }else{
            this.board.placeShip(coord, ship);
        }
    }

    attack(opponentBoard, coord = null) {
        if(coord === null){
            const randomX = 'ABCDEFGHIJ'.split("")[Math.floor(Math.random() * 10)];
            const randomY = Math.floor(Math.random() * 10);
            const randomCoord = {x: randomX, y: randomY};

            this.random.push(randomCoord);
            opponentBoard.reciveAttck(randomCoord);
        }else{
            opponentBoard.reciveAttck(coord);
        }
    }
}

export default Player