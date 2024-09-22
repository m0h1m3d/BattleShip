import GameBoard from "./gameboard.js";

class Dom {
    constructor() {
        this.mainContainer = document.querySelector('.main-container');
        this.menu = document.querySelector('.start-menu');
        this.menuBtn = document.querySelector('.menu');
        this.randomize = document.querySelector('.randomize');
        this.startBtn = document.querySelector('.start-game');
        this.board = document.querySelector('.user-board');
        this.opBoard = document.querySelector('.op-board');
        this.userShips = document.querySelector('.user-ships');
        this.opShips = document.querySelector('.op-ships');
        this.gameOver = document.querySelector('.game-over');
        this.restartBtn = document.querySelector('.restart');
        this.turn = document.querySelector('.turns');
        this.winner = document.querySelector('.winner');
        this.loser = document.querySelector('.loser');
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
            cell.classList.add('ship');
        } else {
            cell = this.opBoard.querySelector(`[data-x = "${coord.x}"][data-y = "${coord.y}"]`);
            cell.style.backgroundColor = '#8faef9';
        }
    }

    startGame(player) {
        this.buttonEffect(player, this.startBtn);

        if (player.board.ships.length === 0) {
            this.randomize.classList.add('pre-start');

            setTimeout(() => {
                this.randomize.classList.remove('pre-start');
            }, 500);
        } else {
            this.menu.classList.add('hidden-lt');

            setTimeout(() => {
                this.opBoard.classList.remove('pre-start');
                this.opShips.classList.remove('pre-start');
            }, 195);

            this.board.classList.add('fade');
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

        const surrounding = player.board.surroundingCells(coord, 'diagonal');
        for (let surCell of surrounding) {
            if (player.type === 'human') {
                const elemenet = this.board.querySelector(`[data-x = "${surCell.x}"][data-y = "${surCell.y}"]`);
                elemenet.classList.add('missed');
            } else {
                const elemenet = this.opBoard.querySelector(`[data-x = "${surCell.x}"][data-y = "${surCell.y}"]`);
                elemenet.classList.add('missed');
            }

            player.board.coordinates.forEach(cell => {
                if (cell.x === surCell.x && cell.y === surCell.y) cell.hit = true;
            });

        }
        let currentTurn = this.turn.textContent;
        this.turn.textContent = 'Hit!';
        this.turn.style.backgroundColor = 'rgb(243, 86, 86)';
        setTimeout(() => {
            currentTurn === 'Your Attack!' ? this.turn.textContent = 'Your Attack!' : this.turn.textContent = 'Enemy Attack!';
            this.turn.style.backgroundColor = '';
        }, 1000);
    }

    renderEmpty(player, coord) {
        let cell;
        if (player.type === 'human') {
            cell = this.board.querySelector(`[data-x = "${coord.x}"][data-y = "${coord.y}"]`);
        } else {
            cell = this.opBoard.querySelector(`[data-x = "${coord.x}"][data-y = "${coord.y}"]`);
        }

        let currentTurn = this.turn.textContent;
        this.turn.textContent = 'Miss!';
        this.turn.style.backgroundColor = 'rgb(233, 231, 231)';
        setTimeout(() => {
            currentTurn === 'Your Attack!' ? this.turn.textContent = 'Your Attack!' : this.turn.textContent = 'Enemy Attack!';
            this.turn.style.backgroundColor = '';
        }, 1000);
        cell.classList.add('missed');
    }

    renderNotEmptyCell(coord) {
        const cell = this.opBoard.querySelector(`[data-x = "${coord.x}"][data-y = "${coord.y}"]`);
        cell.style.border = '1px solid red';
        setTimeout(() => {
            cell.style.border = 'transparent';
        }, 500);
    }

    shipSunk(player, ship) {
        if (player.type === 'human') {
            ship.length === 4 ? ship = this.userShips.querySelector('.destroyer') :
                ship.length === 3 ? ship = ship = this.userShips.querySelector('.warship') :
                    ship.length === 2 ? ship = ship = this.userShips.querySelector('.submarine') :
                        ship.length === 1 ? ship = ship = this.userShips.querySelector('.battleboat') :
                            '';
        } else {
            ship.length === 4 ? ship = this.opShips.querySelector('.destroyer') :
                ship.length === 3 ? ship = ship = this.opShips.querySelector('.warship') :
                    ship.length === 2 ? ship = ship = this.opShips.querySelector('.submarine') :
                        ship.length === 1 ? ship = ship = this.opShips.querySelector('.battleboat') :
                            '';
        }
        const shipName = ship.querySelector('p');
        const shipNumber = ship.querySelector('span');
        shipNumber.textContent--;

        if (+shipNumber.textContent === 0) {
            shipName.style.textDecoration = 'line-through';
            ship.style.color = 'rgb(83, 82, 82)';
        }
    }

    switchTurns() {
        setTimeout(() => {
            this.turn.textContent === 'Your Attack!' ?
                this.turn.textContent = 'Enemy Attacks!' :
                this.turn.textContent = 'Your Attack!'
        }, 1000);
    }

    reset(player = null) {
        if (player === null) {
            setTimeout(() => {
                this.board.classList.add('fade');
                this.opBoard.classList.remove('fade');
            }, 1000);

            this.clearBoard(player);
        } else {
            this.buttonEffect(player, this.randomize);
            this.clearBoard(player);
        }
    }

    clearBoard(player) {
        this.buttonEffect(player, this.restartBtn);
        this.buttonEffect(player, this.menuBtn);

        setTimeout(() => {
            this.gameOver.classList.add('hidden-rt');
        }, 500);

        this.opBoard.childNodes.forEach(cell => {
            cell.classList.remove('attacked');
            cell.classList.remove('missed');
            cell.style.transform = '';
            cell.style.backgroundColor = '';
        })
        this.board.childNodes.forEach(cell => {
            cell.classList.remove('attacked');
            cell.classList.remove('missed');
            cell.style.transform = '';
            player !== null ? cell.style.backgroundColor = '' : '';
        });

        this.resetShips(this.userShips);
        this.resetShips(this.opShips);
    }

    resetShips(shipsElement) {
        const ships = shipsElement.querySelectorAll('.par');
        ships.forEach((ship, i) => {
            ship.style.color = '';
            ship.querySelector('p').style.textDecoration = 'none';

            ship.querySelector('span').textContent = i + 1;
        });
    }

    buttonEffect(player, btn) {
        if (player !== null) {
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);
        } else {
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);
        }
    }

    renderGameOver(player) {
        setTimeout(() => {
            this.gameOver.classList.remove('hidden-rt');
            if (player.type === 'cpu') {
                this.loser.textContent = 'Enemy'
                this.winner.textContent = 'You Win!';
            } else {
                this.loser.textContent = 'Your'
                this.winner.textContent = 'You lose!';
            }
        }, 500);
    }

    renderStartMenu() {
        setTimeout(() => {
            this.opBoard.classList.add('pre-start');
            this.opShips.classList.add('pre-start');
            this.menu.classList.remove('hidden-lt');
        }, 1000);
    }
}
export default new Dom();