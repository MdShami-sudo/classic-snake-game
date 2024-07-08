const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const grid = 20;
const canvasSize = canvas.width;
const gridSize = canvasSize / grid;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let changingDirection = false;
let score = 0;

function main() {
  if (gameOver()) return;

  setTimeout(function onTick() {
    changingDirection = false;
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    drawScore();
    main();
  }, 100);
}

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  if (changingDirection) return;
  changingDirection = true;

  const keyPressed = event.keyCode;
  const goingUp = dy === -1;
  const goingDown = dy === 1;
  const goingLeft = dx === -1;
  const goingRight = dx === 1;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -1;
    dy = 0;
  }

  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -1;
  }

  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 1;
    dy = 0;
  }

  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 1;
  }
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    drawScore();
    generateFood();
  } else {
    snake.pop();
  }
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * grid),
    y: Math.floor(Math.random() * grid)
  };

  for (let segment of snake) {
    if (segment.x === food.x && segment.y === food.y) {
      generateFood();
      break;
    }
  }
}

function drawSnake() {
  snake.forEach(segment => {
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });
}

function drawFood() {
  ctx.fillStyle = '#FF5722';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function drawScore() {
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
}

function gameOver() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      showGameOverScreen();
      return true;
    }
  }

  if (snake[0].x < 0 || snake[0].x >= grid || snake[0].y < 0 || snake[0].y >= grid) {
    showGameOverScreen();
    return true;
  }

  return false;
}

function showGameOverScreen() {
  clearCanvas();
  ctx.fillStyle = '#000';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over!', canvasSize / 2, canvasSize / 2);
  ctx.fillText(`Score: ${score}`, canvasSize / 2, canvasSize / 2 + 40);
}

main();
