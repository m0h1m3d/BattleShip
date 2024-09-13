class GameBoard{
    constructor(){
        this.size = 10;
        this.coordinates = this.generateBoard();
        this.ships = []
    }

    generateBoard(){
        const coordinates = [];
        const letters = 'ABCDEFGHIJ';

        for(let y = 0; y < this.size; y++){
            for (let x = 0; x < this.size; x++) {
                coordinates.push({x: letters[x] , y: y, ship: null, hit: false});
            }
        };
        return coordinates;
    }

    placeShip(coord, ship){
        const cell = this.coordinates.find(cell => coord.x === cell.x && coord.y === cell.y);
        cell.ship = ship;
        
        if(!this.ships.some(storedShip => storedShip.length === ship.length)){
            this.ships.push(ship)
        }
    }

    reciveAttck(coord){
        const cell = this.coordinates.find(cell => coord.x === cell.x && coord.y === cell.y);
        
        if(cell.hit === true){
            return null;
        }else if(cell.ship){
            cell.hit = true;
            cell.ship.hit(this.ships);
        }else{
            this.missed(coord);
        }
    }

    missed(coord){
        const cell = this.coordinates.find(cell => coord.x === cell.x && coord.y === cell.y);
        cell.ship = 'empty';
    }

    allShipsSunk(board){
        return board.ships.every(ship => ship.sunk === true);
    }
}

export default GameBoard;