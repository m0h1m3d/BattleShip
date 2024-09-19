import Dom from "./dom.js";

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

        if (!this.ships.some(storedShip => storedShip.length === ship.length)) {
            this.ships.push(ship)
        }
    }

    reciveAttack(opponentPlayer, coord) {
        let cell = this.coordinates.find(cell => cell.x === coord.x && cell.y === coord.y);

        if (cell.hit === true) {
            console.log('cant hit twice');
            return null;
        } else if (cell.ship && cell.ship !== 'un-available') {
            cell.hit = true;
            cell.ship.hit();
            Dom.renderHit(opponentPlayer, coord);
            console.log('hit');

            if (opponentPlayer.type === 'cpu') {
                const adjacentCells = this.surrounding(coord);

                const validNextHitCoord = adjacentCells.filter(adjCell => {
                    cell = this.coordinates.find(cell => adjCell.x === cell.x && adjCell.y === cell.y);
                    console.log(cell);
                    return cell.hit === false && cell.ship !== 'un-available';
                });


                if (validNextHitCoord.length > 0) {
                    const randomHitCoord = validNextHitCoord[Math.floor(Math.random() * validNextHitCoord.length)];
                    console.log(randomHitCoord);

                    opponentPlayer.board.reciveAttack(opponentPlayer, randomHitCoord);
                } else {
                    console.log("No valid adjacent cells to attack.");
                    const randomX = 'ABCDEFGHIJ'.split("")[Math.floor(Math.random() * 10)];
                    const randomY = Math.floor(Math.random() * 10);
                    const randomCoord = { x: randomX, y: randomY };
                    opponentPlayer.board.reciveAttack(opponentPlayer, randomCoord);
                }
            }

            if (this.allShipsSunk(opponentPlayer.board)) {
                Dom.renderGameOver(opponentPlayer);
            }

        } else {
            this.missed(coord);
            Dom.renderEmpty(opponentPlayer, coord);
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

    allShipsSunk(board) {
        return board.ships.every(ship => ship.sunk === true);
    }
}

export default GameBoard;