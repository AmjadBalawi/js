const gameBoard = document.getElementById('gameBoard');
const scoreElement = document.getElementById('score');
const messageElement = document.getElementById('message');
let board;
let score;

function initializeBoard() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    addRandomTile();
    addRandomTile();
    drawBoard();
}

function drawBoard() {
    gameBoard.innerHTML = '';
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.innerText = board[row][col] !== 0 ? board[row][col] : '';
            tile.style.backgroundColor = getTileColor(board[row][col]);
            gameBoard.appendChild(tile);
        }
    }
    scoreElement.innerText = `Score: ${score}`;
}

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

function addRandomTile() {
    let emptyTiles = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                emptyTiles.push({ row, col });
            }
        }
    }
    if (emptyTiles.length > 0) {
        let { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function move(direction) {
    let moved = false;
    if (direction === 'left') {
        for (let row = 0; row < 4; row++) {
            moved |= slide(row, 0, 1);
        }
    } else if (direction === 'right') {
        for (let row = 0; row < 4; row++) {
            moved |= slide(row, 3, -1);
        }
    } else if (direction === 'up') {
        for (let col = 0; col < 4; col++) {
            moved |= slide(0, col, 4);
        }
    } else if (direction === 'down') {
        for (let col = 0; col < 4; col++) {
            moved |= slide(3, col, -4);
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

function slide(start, end, step) {
    let moved = false;
    let merged = new Array(4).fill(false);
    for (let i = start; i !== end + step; i += step) {
        for (let j = start; j !== end + step; j += step) {
            let current = step === 1 || step === -1 ? j : i;
            let next = current + step;
            while (next >= 0 && next < 4) {
                let x1 = step === 1 || step === -1 ? current : i;
                let y1 = step === 1 || step === -1 ? i : current;
                let x2 = step === 1 || step === -1 ? next : i;
                let y2 = step === 1 || step === -1 ? i : next;
                if (board[x2][y2] === 0) {
                    board[x2][y2] = board[x1][y1];
                    board[x1][y1] = 0;
                    current = next;
                    next += step;
                    moved = true;
                } else if (board[x2][y2] === board[x1][y1] && !merged[next]) {
                    board[x2][y2] *= 2;
                    board[x1][y1] = 0;
                    score += board[x2][y2];
                    merged[next] = true;
                    moved = true;
                    break;
                } else {
                    break;
                }
            }
        }
    }
    return moved;
}

function isGameOver() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                return false;
            }
            if (col < 3 && board[row][col] === board[row][col + 1]) {
                return false;
            }
            if (row < 3 && board[row][col] === board[row + 1][col]) {
                return false;
            }
        }
    }
    return true;
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        move('left');
    } else if (event.key === 'ArrowRight') {
        move('right');
    } else if (event.key === 'ArrowUp') {
        move('up');
    } else if (event.key === 'ArrowDown') {
        move('down');
    }
});

initializeBoard();
