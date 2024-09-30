const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const snakeSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = generateFood();
let score = 0;
let highscore = localStorage.getItem('highscore') || 0;

document.getElementById("highscore").innerText = highscore;

// Game loop
function gameLoop() {
    update();
    draw();
    checkCollision();

    setTimeout(gameLoop, 100); // Speed of the game
}

// Update snake and game state
function update() {
    if (direction.x !== 0 || direction.y !== 0) {
        let newHead = { x: snake[0].x + direction.x * snakeSize, y: snake[0].y + direction.y * snakeSize };
        snake.unshift(newHead);

        if (newHead.x === food.x && newHead.y === food.y) {
            score++;
            document.getElementById("score").innerText = score;
            food = generateFood();
        } else {
            snake.pop();
        }

        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', highscore);
            document.getElementById("highscore").innerText = highscore;
        }
    }
}

// Draw the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Snake
    ctx.fillStyle = "green";
    snake.forEach((segment) => {
        ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
    });

    // Draw Food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
}

// Generate food in a random position
function generateFood() {
    const x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
    const y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
    return { x, y };
}

// Check collision (with walls or itself)
function checkCollision() {
    const head = snake[0];

    // Collision with walls
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        resetGame();
    }

    // Collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

// Reset the game after a collision
function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    score = 0;
    document.getElementById("score").innerText = score;
}

// Handle keypress for movement
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Start the game loop
gameLoop();
