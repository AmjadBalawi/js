const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let food;
let score;

(function setup() {
    snake = new Snake();
    food = new Food();
    food.pickLocation();

    window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake.update();
        snake.draw();
        food.draw();

        if (snake.eat(food)) {
            food.pickLocation();
            score++;
            scoreElement.innerText = score;
        }

        snake.checkCollision();
    }, 100);
}());

window.addEventListener('keydown', (evt) => {
    const direction = evt.key.replace('Arrow', '');
    snake.changeDirection(direction);
});

function Snake() {
    this.body = [];
    this.body[0] = { x: 10 * scale, y: 10 * scale };
    this.xSpeed = scale;
    this.ySpeed = 0;

    this.draw = function() {
        for (let i = 0; i < this.body.length; i++) {
            ctx.fillStyle = "green";
            ctx.fillRect(this.body[i].x, this.body[i].y, scale, scale);
        }
    };

    this.update = function() {
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i] = { ...this.body[i - 1] };
        }

        this.body[0].x += this.xSpeed;
        this.body[0].y += this.ySpeed;
    };

    this.changeDirection = function(direction) {
        switch(direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale;
                    this.ySpeed = 0;
                }
                break;
        }
    };

    this.eat = function(food) {
        if (this.body[0].x === food.x && this.body[0].y === food.y) {
            this.body.push({});
            return true;
        }
        return false;
    };

    this.checkCollision = function() {
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y) {
                alert('Game Over');
                this.body = [{ x: 10 * scale, y: 10 * scale }];
                this.xSpeed = scale;
                this.ySpeed = 0;
                score = 0;
                scoreElement.innerText = score;
            }
        }

        if (this.body[0].x >= canvas.width || this.body[0].x < 0 || this.body[0].y >= canvas.height || this.body[0].y < 0) {
            alert('Game Over');
            this.body = [{ x: 10 * scale, y: 10 * scale }];
            this.xSpeed = scale;
            this.ySpeed = 0;
            score = 0;
            scoreElement.innerText = score;
        }
    };
}

function Food() {
    this.x;
    this.y;

    this.pickLocation = function() {
        this.x = Math.floor(Math.random() * columns) * scale;
        this.y = Math.floor(Math.random() * rows) * scale;
    };

    this.draw = function() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, scale, scale);
    };
}
