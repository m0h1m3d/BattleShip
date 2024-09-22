class Player {
    constructor(type, board) {
        this.type = type;
        this.board = board;
        this.random = [];
    }

    placeShip(ship) {
        const player = this;
        const randomX = 'ABCDEFGHIJ'.split("")[Math.floor(Math.random() * 10)];
        const randomY = Math.floor(Math.random() * 10);
        const randomCoord = { x: randomX, y: randomY };

        this.random.push(randomCoord);
        this.board.placeShip(player, randomCoord, ship);
    }

    attack(opponentPlayer, coord = null) {
        if (coord === null) {
            const randomX = 'ABCDEFGHIJ'.split("")[Math.floor(Math.random() * 10)];
            const randomY = Math.floor(Math.random() * 10);
            const randomCoord = { x: randomX, y: randomY };

            opponentPlayer.board.reciveAttack(opponentPlayer, randomCoord);
        } else {
            opponentPlayer.board.reciveAttack(opponentPlayer, coord);
        }
    }

    resetBoard() {
        this.random.length = 0;
        this.board.reset();
    }

}

export default Player;