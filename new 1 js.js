const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let bird = {
  x: 80,
  y: 300,
  radius: 15,
  velocity: 0
};

let gravity = 0.5;
let pipes = [];
let frame = 0;
let score = 0;
let gameRunning = true;

document.addEventListener("click", flap);

function flap() {
  if (gameRunning) bird.velocity = -8;
}

function createPipe() {
  let gap = 150;
  let topHeight = Math.random() * 250 + 50;

  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap
  });
}

function update() {
  if (!gameRunning) return;

  bird.velocity += gravity;
  bird.y += bird.velocity;

  if (frame % 100 === 0) createPipe();

  pipes.forEach(pipe => {
    pipe.x -= 2;

    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + 50 &&
      (bird.y - bird.radius < pipe.top ||
       bird.y + bird.radius > pipe.bottom)
    ) {
      endGame();
    }

    if (pipe.x === bird.x) score++;
  });

  if (bird.y > canvas.height || bird.y < 0) endGame();

  pipes = pipes.filter(pipe => pipe.x > -50);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();

  // Pipes
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, 50, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, 50, canvas.height);
  });

  // Score
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText(score, 20, 40);
}

function gameLoop() {
  update();
  draw();
  frame++;
  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  document.getElementById("gameOver").style.display = "block";
  document.getElementById("score").innerText = score;
}

function restart() {
  bird.y = 300;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  gameRunning = true;
  document.getElementById("gameOver").style.display = "none";
}

gameLoop();
