const gameBoard = document.getElementById('gameBoard');
const scoreElement = document.getElementById('score');
const messageElement = document.getElementById('message');
let board;
let score;

// Initialize the board and game state
function initializeBoard() {
    board = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
    score = 0;
    addRandomTile();
    addRandomTile();
    drawBoard();
}

// Draw the board based on current state
function drawBoard() {
    gameBoard.innerHTML = '';
    board.forEach(row => {
        row.forEach(cell => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.innerText = cell !== 0 ? cell : '';
            tile.style.backgroundColor = getTileColor(cell);
            gameBoard.appendChild(tile);
        });
    });
    scoreElement.innerText = `Score: ${score}`;
}

// Get tile color based on value
function getTileColor(value) {
    switch (value) {
        case 0: return '#cdc1b4';
        case 2: return '#eee4da';
        case 4: return '#ede0c8';
        case 8: return '#f2b179';
        case 16: return '#f59563';
        case 32: return '#f67c5f';
        case 64: return '#f65e3b';
        case 128: return '#edcf72';
        case 256: return '#edcc61';
        case 512: return '#edc850';
        case 1024: return '#edc53f';
        case 2048: return '#edc22e';
        default: return '#3c3a32';
    }
}

// Add a random tile (either 2 or 4) to an empty spot
function addRandomTile() {
    const emptyTiles = [];
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell === 0) {
                emptyTiles.push({ row: rowIndex, col: colIndex });
            }
        });
    });

    if (emptyTiles.length > 0) {
        const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Handle user input for moving tiles
function move(direction) {
    let moved = false;
    let directionVectors = {
        'ArrowUp': { row: -1, col: 0 },
        'ArrowDown': { row: 1, col: 0 },
        'ArrowLeft': { row: 0, col: -1 },
        'ArrowRight': { row: 0, col: 1 }
    };

    const vector = directionVectors[direction];
    const { row, col } = vector;

    // Move tiles
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] !== 0) {
                let currentRow = i;
                let currentCol = j;
                let nextRow = currentRow + row;
                let nextCol = currentCol + col;

                while (nextRow >= 0 && nextRow < 4 && nextCol >= 0 && nextCol < 4) {
                    if (board[nextRow][nextCol] === 0) {
                        board[nextRow][nextCol] = board[currentRow][currentCol];
                        board[currentRow][currentCol] = 0;
                        currentRow = nextRow;
                        currentCol = nextCol;
                        nextRow += row;
                        nextCol += col;
                        moved = true;
                    } else if (board[nextRow][nextCol] === board[currentRow][currentCol]) {
                        board[nextRow][nextCol] *= 2;
                        score += board[nextRow][nextCol];
                        board[currentRow][currentCol] = 0;
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }

    if (moved) {
        addRandomTile();
        drawBoard();
        if (isGameOver()) {
            messageElement.innerText = 'Game Over!';
        }
    }
}

// Check if the game is over
function isGameOver() {
    // Check if there are any empty spaces
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }

    // Check for possible moves (adjacent tiles with same value)
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (j < 3 && board[i][j] === board[i][j + 1]) {
                return false;
            }
            if (i < 3 && board[i][j] === board[i + 1][j]) {
                return false;
            }
        }
    }

    return true;
}

// Handle keyboard input
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        move(event.key);
    }
});

// Handle touch events for mobile devices
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

gameBoard.addEventListener('touchstart', handleTouchStart);
gameBoard.addEventListener('touchmove', handleTouchMove);

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    event.preventDefault();
    touchEndX = event.touches[0].clientX;
    touchEndY = event.touches[0].clientY;

    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // horizontal swipe
        if (deltaX > 0) {
            move('ArrowRight');
        } else {
            move('ArrowLeft');
        }
    } else {
        // vertical swipe
        if (deltaY > 0) {
            move('ArrowDown');
        } else {
            move('ArrowUp');
        }
    }

    touchStartX = touchEndX;
    touchStartY = touchEndY;
}

// Initialize the board when the page loads
initializeBoard();
