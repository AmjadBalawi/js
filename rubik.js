const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];
let board = [];
const gameBoard = document.getElementById('gameBoard');
const movesElement = document.getElementById('moves');
const timerElement = document.getElementById('timer');
let moves = 0;
let timer = 0;
let interval;

function initializeBoard() {
    board = [
        [0, 1, 2],
        [3, 4, 5],
        [0, 1, 2]
    ];
    drawBoard();
}

function drawBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.backgroundColor = colors[board[i][j]];
            gameBoard.appendChild(cell);
        }
    }
}

function rotateRow(row) {
    const newRow = [];
    for (let i = 0; i < 3; i++) {
        newRow[(i + 1) % 3] = board[row][i];
    }
    board[row] = newRow;
    moves++;
    movesElement.innerText = `Moves: ${moves}`;
    drawBoard();
    checkWin();
}

function rotateColumn(col) {
    const newCol = [];
    for (let i = 0; i < 3; i++) {
        newCol[(i + 1) % 3] = board[i][col];
    }
    for (let i = 0; i < 3; i++) {
        board[i][col] = newCol[i];
    }
    moves++;
    movesElement.innerText = `Moves: ${moves}`;
    drawBoard();
    checkWin();
}

function checkWin() {
    const flattened = board.flat();
    const uniqueColors = new Set(flattened);
    if (uniqueColors.size === 1) {
        clearInterval(interval);
        alert(`Congratulations! You solved the puzzle in ${timer} seconds with ${moves} moves.`);
        initializeBoard();
        shuffleBoard();
    }
}

function startTimer() {
    timer = 0;
    timerElement.innerText = `Time: ${timer}s`;
    interval = setInterval(() => {
        timer++;
        timerElement.innerText = `Time: ${timer}s`;
    }, 1000);
}

function shuffleBoard() {
    for (let i = 0; i < 100; i++) {
        const rowOrCol = Math.random() < 0.5 ? 'row' : 'col';
        const index = Math.floor(Math.random() * 3);
        if (rowOrCol === 'row') {
            rotateRow(index);
        } else {
            rotateColumn(index);
        }
    }
    moves = 0;
    movesElement.innerText = `Moves: ${moves}`;
    clearInterval(interval);
    startTimer();
}

initializeBoard();
shuffleBoard();
