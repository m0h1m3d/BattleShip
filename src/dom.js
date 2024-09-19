import GameBoard from "./gameboard.js";

class Dom {
    constructor() {
        this.mainContainer = document.querySelector('.main-container');
        this.board = document.querySelector('.user-board');
        this.opBoard = document.querySelector('.op-board');
        this.letters = 'ABCDEFGHIJ'.split('');
    }

    init() {
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = document.createElement('div');
                const opCell = document.createElement('div');
                cell.classList.add('cell');
                opCell.classList.add('op-cell');

                cell.dataset.x = this.letters[x];
                cell.dataset.y = y;

                opCell.dataset.x = this.letters[x];
                opCell.dataset.y = y;


                if (x % 10 === 0) {
                    const span = document.createElement('span');
                    const opSpan = document.createElement('span');

                    span.textContent = y;
                    opSpan.textContent = y;

                    span.classList.add('y-coord');
                    opSpan.classList.add('op-y-coord');

                    cell.appendChild(span);
                    opCell.appendChild(opSpan);
                }
                this.board.appendChild(cell);
                this.opBoard.appendChild(opCell);
            }
        }
    }

    placeShip(player, coord) {
        let cell;
        if (player.type === 'human') {
            cell = this.board.querySelector(`[data-x = "${coord.x}"][data-y = "${coord.y}"]`);
            cell.style.backgroundColor = 'grey';
        } else {
            cell = this.opBoard.querySelector(`[data-x = "${coord.x}"][data-y = "${coord.y}"]`);
            cell.style.backgroundColor = '#8faef9';
        }
        // if(player.board.coordinates.find(cell => cell.x === coord.x && cell.y === coord.y).ship !== null) return;

    }

    renderHit(player, coord) {
        let cell;
        if (player.type === 'human') {
            cell = this.board.querySelector(`[data-x = "${coord.x}"][data-y = "${coord.y}"]`);
        } else {
            cell = this.opBoard.querySelector(`[data-x = "${coord.x}"][data-y = "${coord.y}"]`);
        }

        cell.classList.add('attacked');
        cell.style.transform = 'scale(1.1)';
        setTimeout(() => {
            cell.style.transform = 'scale(1)';
        }, 500);

        const surrounding = this.surroundingCells(player, coord);

        surrounding.forEach(surCell => {
            cell = this.opBoard.querySelector(`[data-x = "${surCell.x}"][data-y = "${surCell.y}"]`);
            
            if(player.board.coordinates.find(ship => ship.x === surCell.x && ship.y === surCell.y).ship === 'un-available'){

                if(player.board.coordinates.find(ship => ship.x === surCell.x && ship.y === surCell.y).ship.length === 1){
                    const surrounding = gameboard.surroundingCells(player, {x: surCell.x, y: surCell.y});
                }


                cell.classList.add('missed');
        cell.style.transform = 'scale(1.1)';
            }
        })
    }

    renderEmpty(player, coord) {
        let cell;
        if (player.type === 'human') {
            cell = this.board.querySelector(`[data-x = "${coord.x}"][data-y = "${coord.y}"]`);
        } else {
            cell = this.opBoard.querySelector(`[data-x = "${coord.x}"][data-y = "${coord.y}"]`);
        }

        cell.classList.add('missed');
        cell.style.transform = 'scale(1.1)';
    }

    surroundingCells(player, coord) {
        const letters = 'ABCDEFGHIJ'.split("");
        const indexOfX = letters.indexOf(coord.x);

        const y = coord.y;

        const adjacentMoves = [
            { x: letters[indexOfX + 1], y: y - 1 },
            { x: letters[indexOfX - 1], y: y - 1 },      
            { x: letters[indexOfX - 1], y: y + 1 },  
            { x: letters[indexOfX + 1], y: y + 1 }  
        ];

        return adjacentMoves.filter((move) => letters.includes(move.x) && move.y < 10 && move.y >= 0 && !player.board.coordinates.find(cell => cell.x === move.x && cell.y === move.y).hit);
    }

    renderGameOver(player) {
        console.log('GAME OVER');
    }
}
export default new Dom();