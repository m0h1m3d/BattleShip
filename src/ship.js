import Dom from "./dom.js";
class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
        this.sunk = false;
    }

    hit(player) {
        if (this.hits < this.length) {
            this.hits++;
    
            if (this.hits === this.length) {
                this.sunk = true;
                Dom.shipSunk(player, this);

                const index = player.board.ships.indexOf(this);
                player.board.ships.splice(index, 1);
            }
        }
    }
}

export default Ship;