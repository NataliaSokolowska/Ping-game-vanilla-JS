const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 500;

//game area
const cw = canvas.width;
const ch = canvas.height;

//ball
let ballSize = 10;
let ballX = cw / 2 - ballSize / 2;
let ballY = ch / 2 - ballSize / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

//paddle
const paddleHeight = 100;
const paddleWidth = 20;

//distance paddle from end area (x)
const playerX = 70;
const aiX = 910;

//distance paddle from height area (y)
let playerY = 200;
let aiY = 200;
let playerYSpeed = 30;

const lineWidth = 6;
const lineHeight = 16;

//move paddle
let up = false;
let down = false;

//score
const playerScoreSpan = document.getElementById('playerScore');
const aiScoreSpan = document.getElementById('aiScore');
let playerScore = 0;
let aiScore = 0;
const winingScore = 2;

let gamePaused = false;

let gameInterval = window.setInterval(function () {});

//area game
function table() {
    ctx.fillStyle = '#eeeff1';
    ctx.fillRect(0, 0, 1000, 500);

    for (let linePosition = 20; linePosition < ch; linePosition += 30) {
        ctx.fillStyle = "gray";
        ctx.fillRect(cw / 2 - lineWidth / 2, linePosition, lineWidth, lineHeight);
    }
}

//draw circle Ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, 2 * Math.PI);
    ctx.fillStyle = "#84b71c";
    ctx.fill();
}

//ball
function ball() {
    moveBall();
    hitBall();
    addScore();
}

function moveBall() {
    drawBall();
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY + ballSize >= ch) {
        ballSpeedY = -ballSpeedY;
        speedUp();
    }

    if (ballX <= 0 || ballX + ballSize >= cw) {
        ballSpeedX = -ballSpeedX;
    }
}

//player paddle
function player() {
    ctx.fillStyle = "#a3d3d5";
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight);
}

//ai paddle
function ai() {
    ctx.fillStyle = "#ff3b41";
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight);
}

topCanvas = canvas.offsetTop;

//move paddle
function playerPosition(e) {
    playerY = e.clientY - topCanvas - paddleHeight / 2;

    if (playerY < 0) {
        playerY = 0;
    }
    if (playerY >= ch - paddleHeight) {
        playerY = ch - paddleHeight;
    }
}

//acceleration gry
function speedUp() {
    if (ballSpeedX > 0 && ballSpeedX < 16) {
        ballSpeedX += 0.2;
    } else if (ballSpeedX < 0 && ballSpeedX > -16) {
        ballSpeedX -= 0.2;
    }

    if (ballSpeedY > 0 && ballSpeedY < 16) {
        ballSpeedY += 0.2;
    } else if (ballSpeedY < 0 && ballSpeedY > -16) {
        ballSpeedY -= 0.2;
    }
}

//move ai
function aiPosition() {
    const middlePaddle = aiY + paddleHeight / 2;
    const middleBall = ballY + ballSize / 2;

    if (ballX >= 500) {
        if (middlePaddle - middleBall > 200) {
            aiY -= 12;
        } else if (middlePaddle - middleBall > 40) {
            aiY -= 6;
        } else if (middlePaddle - middleBall < -200) {
            aiY += 12;
        } else if (middlePaddle - middleBall < -40) {
            aiY += 6;
        }
    } else if (ballX <= 500 && ballX > 150) {
        if (middlePaddle - middleBall > 100) {
            aiY -= 4;
        } else if (middlePaddle - middleBall < -100) {
            aiY += 4;
        }
    }
}

//add Score player and ai
function addScore() {
    if (ballX <= playerX) {
        aiScore++;
        aiScoreSpan.textContent = aiScore;

        //if score wil be winingScore show text
        showScreen()
        //if not start a game with current points
        resetBall();
    }
    if (ballX >= aiX) {
        playerScore++;
        playerScoreSpan.textContent = playerScore;

        showScreen();
        resetBall();
    }
}

function resetBall() {
    ballSpeedX = 0;
    ballSpeedY = 0;
    ballX = cw / 2 - ballSize / 2;
    ballY = ch / 2 - ballSize / 2;
    clickToMoveBall();
}

function clickToMoveBall() {
    canvas.addEventListener('click', play);
}

function play() {
    ballSpeedX = 5;
    ballSpeedY = 5;
}

//hit ball from paddle
function hitBall() {
    if (ballX <= playerX + paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballX >= aiX - paddleWidth && ballY >= aiY && ballY <= aiY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }
}

//show Screen win or lose
function showScreen() {
    if (playerScore == winingScore) {
        endGame();
        ctx.fillStyle = "#84b71c";
        ctx.font = "20px Georgia";
        ctx.fillText("You are a winner! Congrats!", cw / 2 - 120, ch / 2 - 100);
        showGameOverBtn();
        againBtn.textContent = 'Play again';
    } else if (aiScore == winingScore) {
        endGame();
        ctx.fillStyle = "#84b71c";
        ctx.font = "20px Georgia";
        ctx.fillText("Not this time. You lost.", cw / 2 - 120, ch / 2 - 100);
        showGameOverBtn();
        againBtn.textContent = 'Try again';
    }
}

function showGameOverBtn() {
    gameOverMenu = document.getElementById('gameOverMenu');
    againBtn = document.getElementById('againBtn');

    gameOverMenu.className = 'active';
    againBtn.addEventListener('click', welcomeGame);
}

function resetScore() {
    playerScore = 0;
    playerScoreSpan.textContent = playerScore;
    aiScore = 0;
    aiScoreSpan.textContent = aiScore;
}

function welcomeGame() {
    table();
    clickKey();
    //background opacity
    ctx.fillStyle = ctx.fillStyle = "rgba(91, 98, 126, 0.9)";
    ctx.fillRect(0, 0, 1000, 500);
    //text canvas
    ctx.fillStyle = "#84b71c";
    ctx.font = "60px Georgia";
    ctx.fillText("Click S to Start the game.", cw / 2 - 300, ch / 2);
    gameOverMenu = document.getElementById('gameOverMenu');
    againBtn = document.getElementById('againBtn');

    gameOverMenu.className = 'game-over';
}

function initGame() {
    gamePaused = false;
    open = false;
    gameInterval = window.setInterval(function () {
        table();
        ball();
        player();
        ai();
        aiPosition();
    }, 1000 / 60);
    resetScore();
}

function endGame() {
    clearInterval(gameInterval);
    table();
    player();
    ai();
    ctx.fillStyle = ctx.fillStyle = "rgba(91, 98, 126, 0.9)";
    ctx.fillRect(0, 0, 1000, 500);
    ctx.fillStyle = "#84b71c";
    ctx.font = "60px Georgia";
    ctx.fillText("End game", cw / 2 - 120, ch / 2);
}

function togglePause() {
    if (gamePaused) {
        resumeGame();
    } else {
        ctx.fillStyle = '#5b627e';
        ctx.fillRect(0, 0, 1000, 500);
        ctx.fillStyle = "#84b71c";
        ctx.font = "60px Georgia";
        ctx.fillText("Click P to return to the game", cw / 2 - 300, ch / 2);
        pauseGame();
    }
}

function resumeGame() {
    if (gamePaused) {
        gamePaused = false;
        initGame();
    }
}

function pauseGame() {
    if (!gamePaused) {
        gamePaused = true;
        clearInterval(gameInterval);
    }
}

function clickKey() {
    document.onkeyup = function (e) {
        if (e.keyCode == 83) {
            console.log('start');
            //setInterval(initGame, 1000 / 60);
            //intervalId = setInterval(initGame, 1000 / 60);
            initGame();
        }
    }
}

const instructionBtn = document.getElementById('instructionBtn');

function toggleInstruction() {
    let instruction = document.getElementById('instruction-hidden');

    if (instruction.style.display == 'none' || instruction.style.display === '') {
        instruction.style.display = 'block';
    } else {
        instruction.style.display = 'none';
    }
}

window.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
        case 80:
            togglePause();
            break;
    }
});


welcomeGame();
canvas.addEventListener('mousemove', playerPosition);
instructionBtn.addEventListener('click', toggleInstruction);