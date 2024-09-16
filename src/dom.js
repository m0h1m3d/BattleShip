class Dom {
    static init(){
        const mainContainer = document.querySelector('.main-container');
        const board = document.querySelector('.user-board');
        const opBoard = document.querySelector('.op-board');
        const letters = 'ABCDEFGHIJ'.split('');

        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = document.createElement('div');
                const opCell = document.createElement('div');
                cell.classList.add('cell');
                opCell.classList.add('op-cell');

                cell.dataset.x = letters[x];
                cell.dataset.y = y;

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
                board.appendChild(cell);
                opBoard.appendChild(opCell);
            }            
        }
    }
}
export default Dom;
