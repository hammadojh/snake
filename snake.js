const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');

// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = canvas.width / GRID_SIZE;

// Game variables
let snake = [];
let direction = { x: 1, y: 0 };
let food = {};
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gameSpeed = 100;

// Initialize high score display
highScoreElement.textContent = highScore;

// Initialize game
function init() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    score = 0;
    scoreElement.textContent = score;
    generateFood();
    gameRunning = true;
    gameSpeed = 100;
}

// Generate random food position
function generateFood() {
    do {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

// Draw functions
function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Draw head
            drawCell(segment.x, segment.y, '#4ade80');
        } else {
            // Draw body
            drawCell(segment.x, segment.y, '#22c55e');
        }
    });

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Update game state
function update() {
    if (!gameRunning) return;

    // Move snake
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameOver();
        return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
        
        // Increase speed slightly
        gameSpeed = Math.max(50, gameSpeed - 2);
    } else {
        snake.pop();
    }
}

// Game over
function gameOver() {
    gameRunning = false;
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }

    // Show game over message
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 30);
    ctx.font = '20px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    ctx.font = '16px Arial';
    ctx.fillText('Click "Start Game" to play again', canvas.width / 2, canvas.height / 2 + 40);
}

// Game loop
function gameLoop() {
    update();
    draw();
    
    if (gameRunning) {
        setTimeout(gameLoop, gameSpeed);
    }
}

// Input handling
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) {
                direction = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
            if (direction.y === 0) {
                direction = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
            if (direction.x === 0) {
                direction = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (direction.x === 0) {
                direction = { x: 1, y: 0 };
            }
            break;
    }
});

// Start button
startBtn.addEventListener('click', () => {
    init();
    gameLoop();
});

// Initial draw
draw();