class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
        this.sunk = false;
    }

    hit(ships) {
        if (this.hits < this.length) {
            this.hits++;
    
            if (this.hits === this.length) {
                this.sunk = true;
                const sunkShipIndex = ships.find((ship,i)=> ship.sunk === true ? i : '');
                ships.splice(sunkShipIndex, 1);
            }
        }
    }

    isSunk() {
        return this.sunk;
    }
}

export default Ship;