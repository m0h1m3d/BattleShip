class GameBoard {
    constructor() {
        this.size = 10;
        this.coordinates = this.generateBoard();
        this.ships = []
    }

    generateBoard() {
        const coordinates = [];
        const letters = 'ABCDEFGHIJ';

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                coordinates.push({ x: letters[x], y: y, ship: null, hit: false });
            }
        };
        return coordinates;
    }

    placeShip(coord, ship) {
        const cell = this.coordinates.find(cell => coord.x === cell.x && coord.y === cell.y);
        cell.ship = ship;

        if (!this.ships.some(storedShip => storedShip.length === ship.length)) {
            this.ships.push(ship)
        }
    }

    reciveAttack(opponentPlayer, coord) {
        const cell = this.coordinates.find(cell => cell.x === coord.x && cell.y === coord.y);

        if (cell.hit === true) {
            return null;
        } else if (cell.ship) {
            console.log('hit');
            cell.hit = true;
            cell.ship.hit(this.ships);

            if (opponentPlayer.type !== 'cpu') {
                const adjacentCells = this.adjacentCells(coord);

                if (adjacentCells.length > 0) {
                    const randomIndex = Math.floor(Math.random() * adjacentCells.length);
                    const newCoord = adjacentCells[randomIndex];
                    opponentPlayer.random = [newCoord];//for testing
                    opponentPlayer.board.reciveAttack(opponentPlayer, newCoord);
                }
            }

        } else {
            this.missed(coord);
        }
    }

    adjacentCells(coord) {
        const letters = 'ABCDEFGHIJ'.split("");
        const indexOfX = letters.indexOf(coord.x);

        const  y = coord.y;
        
        const adjacentMoves = [{
            x: letters[indexOfX + 1], y: y
        },{
            x: letters[indexOfX - 1], y: y
        },{
            x: letters[indexOfX], y: y + 1
        },{
            x: letters[indexOfX], y: y - 1
        }];

        return adjacentMoves.filter((move)=> letters.includes(move.x) && move.y < this.size && move.y >= 0 && !this.coordinates.find(cell => cell.x === move.x && cell.y === move.y).hit);
    }

    missed(coord) {
        const cell = this.coordinates.find(cell => coord.x === cell.x && coord.y === cell.y);
        cell.hit = true;
        cell.ship = 'empty';
    }

    allShipsSunk(board) {
        return board.ships.every(ship => ship.sunk === true);
    }
}

export default GameBoard;