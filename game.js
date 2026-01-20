let gameState = "start";
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// STATEK
let ship = {
  x: 80,
  y: 300,
  size: 90,
  hitbox: 40,
  velocity: 0
  
};

let gravity = 0.5;
let asteroids = [];
let frame = 0;
let score = 0;
let gameRunning = true;

// OBRAZY
const bgImg = new Image();
bgImg.src = "spacetlo.jpeg";

const shipImg = new Image();
shipImg.src = "statekspace.png";

const asteroidImg = new Image();
asteroidImg.src = "asteroids.png";

// STEROWANIE
document.addEventListener("click", boost);
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") boost();
});

function boost() {
  if (gameState === "playing") {
    ship.velocity = -8;
  }
}

// ASTEROIDY
function createAsteroids() {
  let gap = 200;
  let topHeight = Math.random() * 250 + 40;

  asteroids.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap
  });
}

// UPDATE
function update() {
  if (gameState !== "playing") return;

  ship.velocity += gravity;
  ship.y += ship.velocity;

  if (frame % 100 === 0) createAsteroids();

  asteroids.forEach(a => {
    a.x -= 2;

    // KOLIZJA
    if (
      ship.x + ship.size > a.x &&
      ship.x < a.x + 60 &&
      (ship.y < a.top || ship.y + ship.size > a.bottom)
    ) {
      endGame();
    }

    if (a.x === ship.x) score++;
  });

  if (ship.y < 0 || ship.y + ship.size > canvas.height) {
    endGame();
  }

  asteroids = asteroids.filter(a => a.x > -60);
}

// DRAW
function draw() {
  // TŁO
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // STATEK
  ctx.drawImage(shipImg, ship.x, ship.y, ship.size, ship.size);

  // ASTEROIDY
  asteroids.forEach(a => {
    ctx.drawImage(asteroidImg, a.x, 0, 60, a.top);
    ctx.drawImage(
      asteroidImg,
      a.x,
      a.bottom,
      60,
      canvas.height - a.bottom
    );
  });

  // WYNIK
  ctx.fillStyle = "white";
  ctx.font = "28px Arial";
  ctx.fillText(score, 20, 40);
}

// PĘTLA GRY
function gameLoop() {
  update();
  draw();
  frame++;
  requestAnimationFrame(gameLoop);
}

// GAME OVER
function endGame() {
  gameRunning = false;
  document.getElementById("gameOver").style.display = "block";
  document.getElementById("score").innerText = score;
}

// RESTART
function restart() {
  ship.y = 300;
  ship.velocity = 0;
  asteroids = [];
  score = 0;
  frame = 0;
  gameRunning = true;
  document.getElementById("gameOver").style.display = "none";
}

gameLoop();







