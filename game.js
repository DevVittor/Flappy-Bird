const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById("game-container");

const flappyImg = new Image();
flappyImg.src = "imgs/Flappy Bird.png";

const FLAP_SPEED = -5; //padrão -5
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

let birdx = 50;
let birdy = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

let pipeX = 400;
let pipeY = canvas.height - 200;

let scoreDiv = document.getElementById("score-display");
let score = 0;
let highScore = 0;

let scored = false;

document.body.onkeyup = (e) => {
  if (e.code == "Space") {
    birdVelocity = FLAP_SPEED;
  }
};

document.getElementById("restart-button").addEventListener("click", () => {
  hideEndMenu();
  resetGame();
  loop();
});

const increaseScore = () => {
  if (
    birdx > pipeX + PIPE_WIDTH &&
    (birdy < pipeY + PIPE_GAP || birdy + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
    !scored
  ) {
    score++;
    scoreDiv.innerHTML = score;
    scored = true;
  }
  if (birdx < pipeX + PIPE_WIDTH) {
    scored = false;
  }
};

const collisionCheck = () => {
  const birdBox = {
    x: birdx,
    y: birdy,
    width: BIRD_WIDTH,
    height: BIRD_HEIGHT,
  };
  const topPipeBox = {
    x: pipeX,
    y: pipeY - PIPE_GAP + BIRD_HEIGHT,
    width: PIPE_WIDTH,
    height: pipeY,
  };

  const bottomPipeBox = {
    x: pipeX,
    y: pipeY + PIPE_GAP + BIRD_HEIGHT,
    width: PIPE_WIDTH,
    height: canvas.height - pipeY - PIPE_GAP,
  };

  if (
    birdBox.x + birdBox.width > topPipeBox.x &&
    birdBox.x < topPipeBox.x + topPipeBox.width &&
    birdBox.y < topPipeBox.y
  ) {
    return true;
  }
  if (
    birdBox.x + birdBox.width > bottomPipeBox.x &&
    birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
    birdBox.y + birdBox.height > bottomPipeBox.y
  ) {
    return true;
  }
  if (birdy < 0 || birdy + BIRD_HEIGHT > canvas.height) {
    return true;
  }
  return false;
};

const hideEndMenu = () => {
  document.getElementById("end-menu").style.display = "none";
  gameContainer.classList.remove("backdrop-blur");
};

const showEndMenu = () => {
  document.getElementById("end-menu").style.display = "block";
  gameContainer.classList.add("backdrop-blur");
  document.getElementById("end-score").innerHTML = score;
  if (highScore < score) {
    highScore = score;
  }
  document.getElementById("best-score").innerHTML = highScore;
};

const resetGame = () => {
  birdx = 50;
  birdy = 50;
  birdVelocity = 0;
  birdAcceleration = 0.1;

  pipeX = 400;
  pipeY = canvas.height - 200;

  score = 0;
};

const endGame = () => {
  showEndMenu();
};

const loop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(flappyImg, birdx, birdy);
  ctx.fillStyle = "#75BF30";
  ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
  ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

  if (collisionCheck()) {
    endGame();
    return;
  }

  pipeX -= 1.5;

  if (pipeX < -50) {
    pipeX = 400;
    pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
  }

  birdVelocity += birdAcceleration;
  birdy += birdVelocity;

  increaseScore();
  requestAnimationFrame(loop);
};

loop();
