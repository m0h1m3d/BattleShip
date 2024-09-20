import Dom from "./dom.js";

class GameBoard {
    constructor() {
        this.size = 10;
        this.coordinates = this.generateBoard();
        this.ships = [];
        this.attacked = [];
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

    placeShip(player, coord, ship) {
        const letters = 'ABCDEFGHIJ'.split('');
        let shipCells = [];
        let indexOfX = letters.indexOf(coord.x);
        let currentY = coord.y;
        let currentX = coord.x
        const directions = ['x', 'y'];
        let randomDir = directions[Math.floor(Math.random() * 2)];

        for (let i = 0; i < ship.length; i++) {
            shipCells.push({ x: currentX, y: currentY });

            if (coord.x <= 'G') {
                if (randomDir === 'x') {
                    indexOfX++;
                    currentX = letters[indexOfX];
                } else {
                    coord.y > 6 ? currentY-- : currentY++;
                }
            } else {
                coord.y > 6 ? currentY-- : currentY++;
            }
        }

        const validPlacement = shipCells.every(cell => {
            const currentCell = player.board.coordinates.find(coord => coord.x === cell.x && coord.y === cell.y);

            return currentCell.ship === null;
        });

        if (!validPlacement) {
            shipCells = [];

            const randomX = letters[Math.floor(Math.random() * 10)];
            const randomY = Math.floor(Math.random() * 10);
            const randomCoord = { x: randomX, y: randomY };

            this.placeShip(player, randomCoord, ship);
            return;
        }

        for (let i = 0; i < ship.length; i++) {
            const newCoord = shipCells[i];
            let cell = player.board.coordinates.find(cell => cell.x === newCoord.x && cell.y === newCoord.y);

            cell.ship = ship;
            if (player.type === 'cpu') continue;
            Dom.placeShip(player, newCoord);
        }

        const surroundingCells = this.getShipSurroundingCells(shipCells);

        player.board.coordinates.forEach(cell => {
            for (let surCell of surroundingCells) {
                if (cell.x === surCell.x && cell.y === surCell.y) {
                    cell.ship = 'un-available';
                }
            }
        });

        
        this.ships.push(ship)
    }

    reciveAttack(opponentPlayer, coord) {
        let cell = this.coordinates.find(cell => cell.x === coord.x && cell.y === coord.y);
        
        if (cell.hit === true) {
            if (opponentPlayer.type === 'human') {
                console.log('hit  twice at', coord);
                const randomX = 'ABCDEFGHIJ'.split("")[Math.floor(Math.random() * 10)];
                const randomY = Math.floor(Math.random() * 10);
                const randomCoord = { x: randomX, y: randomY };
                
                this.attacked.pop();
                this.attacked.push(randomCoord);
                opponentPlayer.board.reciveAttack(opponentPlayer, randomCoord);
                return;
            } else {
                Dom.renderNotEmptyCell(coord);
                return;
            }
        } else {
            if (cell.ship && cell.ship !== 'un-available' && cell.ship !== 'empty' && cell.hit !== true) {
                cell.hit = true;
                cell.ship.hit(opponentPlayer.board);
                Dom.renderHit(opponentPlayer, coord);
                opponentPlayer.board.attacked.pop();
                opponentPlayer.board.attacked.push(coord);

                if (this.allShipsSunk()) {
                    console.log('game over');
                    Dom.renderGameOver(opponentPlayer);
                }

            } else {
                opponentPlayer.board.attacked.pop();
                opponentPlayer.board.attacked.push(coord);
                this.missed(coord);
                Dom.renderEmpty(opponentPlayer, coord);
            }
        }
    }

    surroundingCells(coord) {
        const letters = 'ABCDEFGHIJ'.split("");
        const indexOfX = letters.indexOf(coord.x);

        const y = coord.y;

        const adjacentMoves = [
            { x: letters[indexOfX + 1], y },
            { x: letters[indexOfX + 1], y: y - 1 },
            { x: letters[indexOfX], y: y - 1 },
            { x: letters[indexOfX - 1], y: y - 1 },
            { x: letters[indexOfX - 1], y },
            { x: letters[indexOfX - 1], y: y + 1 },
            { x: letters[indexOfX], y: y + 1 },
            { x: letters[indexOfX + 1], y: y + 1 }
        ];

        return adjacentMoves.filter((move) => letters.includes(move.x) && move.y < this.size && move.y >= 0 && !this.coordinates.find(cell => cell.x === move.x && cell.y === move.y).hit);
    }

    surrounding(coord) {
        const letters = 'ABCDEFGHIJ'.split("");
        const indexOfX = letters.indexOf(coord.x);

        const y = coord.y;

        const adjacentMoves = [
            { x: letters[indexOfX + 1], y },
            { x: letters[indexOfX], y: y - 1 },
            { x: letters[indexOfX - 1], y },
            { x: letters[indexOfX], y: y + 1 },
        ];

        return adjacentMoves.filter((move) => letters.includes(move.x) && move.y < this.size && move.y >= 0 && !this.coordinates.find(cell => cell.x === move.x && cell.y === move.y).hit);
    }

    getShipSurroundingCells(shipCells) {
        const surroundingCells = new Set();

        shipCells.forEach(cell => {
            const surrounding = this.surroundingCells(cell);
            surrounding.forEach(coord => {
                const cell = this.coordinates.find(c => c.x === coord.x && c.y === coord.y);
                if (cell && !shipCells.some(shipCell => shipCell.x === cell.x && shipCell.y === cell.y)) {
                    surroundingCells.add(`${coord.x}-${coord.y}`);
                }
            });
        });

        return Array.from(surroundingCells).map(cell => {
            const [x, y] = cell.split('-');
            return { x, y: parseInt(y) };
        });
    }

    missed(coord) {
        const cell = this.coordinates.find(cell => coord.x === cell.x && coord.y === cell.y);
        cell.hit = true;
        cell.ship = 'empty';
    }

    allShipsSunk() {
       return this.ships.length === 0 ? true : false
    }

    reset() {
        this.ships.forEach(ship => {
            ship.hits = 0;
            ship.sunk = false;
        })

        this.coordinates.forEach(coord => {
            coord.ship = null;
            coord.hit = false;
        });
    }
}

export default GameBoard;