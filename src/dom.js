import GameBoard from "./gameboard.js";

class Dom {
    constructor() {
        this.mainContainer = document.querySelector('.main-container');
        this.board = document.querySelector('.user-board');
        this.opBoard = document.querySelector('.op-board');
        this.gameOver = document.querySelector('.game-over');
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
            cell.style.backgroundColor = '#0f4d49';
        } else {
            cell = this.opBoard.querySelector(`[data-x = "${coord.x}"][data-y = "${coord.y}"]`);
            cell.style.backgroundColor = '#8faef9';
        }
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
        for(let surCell of surrounding){
            if (player.type === 'human'){
                const elemenet = this.board.querySelector(`[data-x = "${surCell.x}"][data-y = "${surCell.y}"]`); 
                elemenet.classList.add('missed');
                elemenet.style.transform = 'scale(1.1)';
            }else{
                const elemenet = this.opBoard.querySelector(`[data-x = "${surCell.x}"][data-y = "${surCell.y}"]`); 
                elemenet.classList.add('missed');
                elemenet.style.transform = 'scale(1.1)';
            }

            player.board.coordinates.forEach(cell => {
                if(cell.x === surCell.x && cell.y === surCell.y) cell.hit = true;
            })
        }
    }

    renderEmpty(player, coord) {
        let cell;
        if (player.type === 'human') {
            cell = this.board.querySelector(`[data-x = "${coord.x}"][data-y = "${coord.y}"]`);
        }else{
            cell = this.opBoard.querySelector(`[data-x = "${coord.x}"][data-y = "${coord.y}"]`);
        }
        
        cell.classList.add('missed');
        cell.style.transform = 'scale(1.1)';
    }

    renderNotEmptyCell(coord){
        const cell = this.opBoard.querySelector(`[data-x = "${coord.x}"][data-y = "${coord.y}"]`);
        cell.style.border = '1px solid red';
        setTimeout(() => {
            cell.style.border = 'transparent';
        }, 500);
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

    resetBoard(player){
        if(player.type === 'cpu'){
            this.opBoard.childNodes.forEach(cell=>{
                cell.classList.remove('attacked');
                cell.classList.remove('missed');
                cell.style.transform = 'scale(1)';
                cell.style.backgroundColor = '#384955';
            })
        }else{
            this.board.childNodes.forEach(cell=>{
                cell.classList.remove('attacked');
                cell.classList.remove('missed');
                cell.style.transform = 'scale(1)';
                cell.style.backgroundColor = 'lightseagreen';
            })
        }
    }

    renderGameOver(player) {
        setTimeout(() => {
            this.gameOver.classList.remove('hidden');
        }, 500);
        console.log('GAME OVER');
    }
}
export default new Dom();