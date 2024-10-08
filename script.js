const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restart-btn');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');

// Set up initial values
const gridSize = 20;
const canvasSize = 400;
let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
let direction = { x: 0, y: 0 };
let food = { x: gridSize * 10, y: gridSize * 10 };
let score = 0;
let gameOver = false;

// Draw the snake, food, and score
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the snake
    snake.forEach(part => {
        ctx.fillStyle = 'lime';
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Move the snake
function update() {
    if (gameOver) return;

    // Add new head based on the current direction
    const head = { x: snake[0].x + direction.x * gridSize, y: snake[0].y + direction.y * gridSize };

    // Check for collisions with walls or self
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || snake.some(part => part.x === head.x && part.y === head.y)) {
        gameOver = true;
        endGame();
        return;
    }

    // Add the new head
    snake.unshift(head);

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        // Remove the last part of the snake (no growth if no food eaten)
        snake.pop();
    }
}

// Place food in a random location on the grid
function placeFood() {
    food.x = Math.floor(Math.random() * canvas.width / gridSize) * gridSize;
    food.y = Math.floor(Math.random() * canvas.height / gridSize) * gridSize;

    // Ensure food does not spawn on the snake
    if (snake.some(part => part.x === food.x && part.y === food.y)) {
        placeFood();
    }
}

// Handle key presses to change the direction
document.addEventListener('keydown', event => {
    const key = event.key;
    if (key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (key === 'ArrowRight' && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
});

// End the game
function endGame() {
    gameOverScreen.classList.remove('hidden');
    scoreDisplay.textContent = score;
}

// Restart the game
restartBtn.addEventListener('click', () => {
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: 0, y: 0 };
    food = { x: gridSize * 10, y: gridSize * 10 };
    score = 0;
    gameOver = false;
    gameOverScreen.classList.add('hidden');
});

// Game loop
function gameLoop() {
    if (!gameOver) {
        update();
        draw();
    }
    setTimeout(gameLoop, 100);
}

// Start the game
placeFood();
gameLoop();
