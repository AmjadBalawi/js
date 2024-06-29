document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    let score = 0;
    let timer = 0;
    let interval;
    let nextNumber = 1;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createBoard() {
        const numbers = Array.from({ length: 16 }, (_, i) => i + 1);
        shuffle(numbers);

        gameBoard.innerHTML = '';
        numbers.forEach(number => {
            const cube = document.createElement('div');
            cube.classList.add('cube');
            cube.innerText = number;
            cube.addEventListener('click', () => handleCubeClick(number, cube));
            gameBoard.appendChild(cube);
        });
    }

    function handleCubeClick(number, cube) {
        if (number === nextNumber) {
            cube.classList.add('hidden');
            nextNumber++;
            score++;
            scoreElement.innerText = `Score: ${score}`;

            if (nextNumber > 16) {
                clearInterval(interval);
                alert(`Congratulations! You completed the game in ${timer} seconds with a score of ${score}.`);
                resetGame();
            }
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

    function resetGame() {
        clearInterval(interval);
        score = 0;
        nextNumber = 1;
        scoreElement.innerText = `Score: ${score}`;
        createBoard();
        startTimer();
    }

    createBoard();
    startTimer();
});
