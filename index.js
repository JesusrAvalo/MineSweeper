let board = [];
let rows, cols, totalMines;
let gameOver = false;

function startGame() {
    rows = parseInt(document.getElementById("rows").value) || 5;
    cols = parseInt(document.getElementById("cols").value) || 5;
    totalMines = parseInt(document.getElementById("mines").value) || 5;
    
    if (rows < 5 || cols < 5 || totalMines < 1) {
        alert("Parámetros inválidos. Asegúrate de cumplir con los mínimos.");
        return;
    }

    generateBoard();
    placeMines();
    renderBoard();
    gameOver = false;
}

function generateBoard() {
    board = Array.from({ length: rows }, () => Array(cols).fill({ revealed: false, mine: false, flag: false, count: 0 }));
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < totalMines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!board[r][c].mine) {
            board[r][c].mine = true;
            minesPlaced++;
            incrementNeighbors(r, c);
        }
    }
}

function incrementNeighbors(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (isInBounds(newRow, newCol) && !board[newRow][newCol].mine) {
                board[newRow][newCol].count++;
            }
        }
    }
}

function isInBounds(row, col) {
    return row >= 0 && row < rows && col >= 0 && col < cols;
}

function renderBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    boardDiv.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    boardDiv.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

    board.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            cellDiv.dataset.row = rIndex;
            cellDiv.dataset.col = cIndex;
            cellDiv.addEventListener("click", revealCell);
            cellDiv.addEventListener("contextmenu", toggleFlag);
            boardDiv.appendChild(cellDiv);
        });
    });
}

function revealCell(event) {
    if (gameOver) return;
    
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const cell = board[row][col];

    if (cell.revealed || cell.flag) return;
    cell.revealed = true;

    const cellDiv = event.target;
    cellDiv.classList.add("revealed");

    if (cell.mine) {
        cellDiv.classList.add("mine");
        alert("¡Has perdido!");
        gameOver = true;
        return;
    }

    if (cell.count > 0) {
        cellDiv.textContent = cell.count;
    } else {
        revealAdjacentCells(row, col);
    }

    checkWin();
}

function revealAdjacentCells(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (isInBounds(newRow, newCol) && !board[newRow][newCol].revealed && !board[newRow][newCol].mine) {
                const cellDiv = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
                revealCell({ target: cellDiv });
            }
        }
    }
}

function toggleFlag(event) {
    event.preventDefault();
    if (gameOver) return;
    
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const cell = board[row][col];

    if (cell.revealed) return;

    cell.flag = !cell.flag;
    event.target.classList.toggle("flag");
}

function checkWin() {
    let revealedCells = 0;
    board.forEach(row => row.forEach(cell => {
        if (cell.revealed) revealedCells++;
    }));

    if (revealedCells === rows * cols - totalMines) {
        alert("¡Has ganado!");
        gameOver = true;
    }
}
