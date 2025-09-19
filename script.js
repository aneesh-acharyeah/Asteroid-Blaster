// Game Variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');

let score = 0;
let level = 1;
let isGameOver = false;
let spaceship = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 50, speed: 5 };
let bullets = [];
let asteroids = [];
let asteroidSpeed = 2;
let gameInterval;

// Spaceship and Bullet movement
const spaceshipImage = new Image();
spaceshipImage.src = 'https://example.com/spaceship.png'; // You can replace this with an actual image URL or use a shape

// Asteroid Properties
const asteroidImage = new Image();
asteroidImage.src = 'https://example.com/asteroid.png'; // Asteroid image URL

// Draw functions
function drawSpaceship() {
  ctx.drawImage(spaceshipImage, spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawBullet(bullet) {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bullet.x, bullet.y, 5, 10);
}

function drawAsteroid(asteroid) {
  ctx.drawImage(asteroidImage, asteroid.x, asteroid.y, asteroid.width, asteroid.height);
}

// Create Asteroid
function createAsteroid() {
  let x = Math.random() * (canvas.width - 40);
  let asteroid = { x: x, y: -40, width: 40, height: 40, speed: asteroidSpeed };
  asteroids.push(asteroid);
}

// Create Bullet
function createBullet() {
  let bullet = { x: spaceship.x + spaceship.width / 2 - 2.5, y: spaceship.y, speed: 4 };
  bullets.push(bullet);
}

// Check for Collision with Asteroids
function checkCollisions() {
  for (let i = 0; i < asteroids.length; i++) {
    for (let j = 0; j < bullets.length; j++) {
      let asteroid = asteroids[i];
      let bullet = bullets[j];

      if (bullet.x < asteroid.x + asteroid.width &&
        bullet.x + 5 > asteroid.x &&
        bullet.y < asteroid.y + asteroid.height &&
        bullet.y + 10 > asteroid.y) {
        asteroids.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        scoreDisplay.textContent = score;
      }
    }
  }
}

// Move Asteroids
function moveAsteroids() {
  for (let asteroid of asteroids) {
    asteroid.y += asteroid.speed;
  }
}

// Check for Game Over
function checkGameOver() {
  for (let asteroid of asteroids) {
    if (asteroid.y + asteroid.height >= spaceship.y) {
      isGameOver = true;
      alert('Game Over!');
      clearInterval(gameInterval);
    }
  }
}

// Move Spaceship
function moveSpaceship() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && spaceship.x > 0) {
      spaceship.x -= spaceship.speed;
    } else if (e.key === 'ArrowRight' && spaceship.x < canvas.width - spaceship.width) {
      spaceship.x += spaceship.speed;
    } else if (e.key === ' ' && !isGameOver) {
      createBullet();
    }
  });
}

// Update Game State
function update() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSpaceship();
  moveAsteroids();

  for (let bullet of bullets) {
    bullet.y -= bullet.speed;
    drawBullet(bullet);
  }

  for (let asteroid of asteroids) {
    drawAsteroid(asteroid);
  }

  checkCollisions();
  checkGameOver();

  if (asteroids.length === 0) {
    level += 1;
    levelDisplay.textContent = level;
    asteroidSpeed += 0.5;
    createAsteroidWave();
  }
}

// Create Asteroid Wave
function createAsteroidWave() {
  let numberOfAsteroids = level * 5;
  for (let i = 0; i < numberOfAsteroids; i++) {
    createAsteroid();
  }
}

// Start Game
function startGame() {
  createAsteroidWave();
  gameInterval = setInterval(update, 1000 / 60); // 60 FPS
}

startGame();
