// script.js

let board = [];
let rows = 10;
let columns = 10;
let mines = 10;

function startGame() {
    rows = parseInt(document.getElementById("rows").value);
    columns = parseInt(document.getElementById("columns").value);
    mines = parseInt(document.getElementById("mines").value);
    
    document.getElementById("board").style.gridTemplateRows = `repeat(${rows}, 30px)`;
    document.getElementById("board").style.gridTemplateColumns = `repeat(${columns}, 30px)`;
    
    generateBoard();
}

function generateBoard() {
    board = [];
    document.getElementById("board").innerHTML = '';
    
    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < columns; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-row', r);
            cell.setAttribute('data-col', c);
            cell.addEventListener('click', handleClick);
            document.getElementById("board").appendChild(cell);
            board[r][c] = {
                mine: false,
                uncovered: false,
                flagged: false,
                element: cell
            };
        }
    }
    placeMines();
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        let row = Math.floor(Math.random() * rows);
        let col = Math.floor(Math.random() * columns);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            minesPlaced++;
        }
    }
}

function handleClick(event) {
    const row = parseInt(event.target.getAttribute('data-row'));
    const col = parseInt(event.target.getAttribute('data-col'));

    if (board[row][col].mine) {
        event.target.classList.add('mine');
        alert("Game Over!");
    } else {
        uncoverCell(row, col);
    }
}

function uncoverCell(row, col) {
    if (row < 0 || col < 0 || row >= rows || col >= columns) return;
    const cell = board[row][col];
    if (cell.uncovered || cell.mine) return;

    cell.uncovered = true;
    cell.element.classList.add('uncovered');
    
    let minesAround = countMinesAround(row, col);
    if (minesAround > 0) {
        cell.element.textContent = minesAround;
        cell.element.classList.add(`number-${minesAround}`);
    } else {
        uncoverNeighbors(row, col);
    }
}

function countMinesAround(row, col) {
    let count = 0;
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            if (row + r >= 0 && row + r < rows && col + c >= 0 && col + c < columns) {
                if (board[row + r][col + c].mine) count++;
            }
        }
    }
    return count;
}

function uncoverNeighbors(row, col) {
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            uncoverCell(row + r, col + c);
        }
    }
}
