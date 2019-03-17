// I have added " // * " above the code I have added or changed.
// I have change certain values throughout as well.

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 1;
var dy = -1;
var ballRadius = 10;
var paddleHeight = 12;
var paddleWidth = 100;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 4;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
var score = 0;
var lives = 3;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// *
//This function generates a random integer between "min and max"
const random = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

function drawBall() {
  context.beginPath();
  context.arc(x, y, ballRadius, 0, Math.PI * 2);
  context.fillStyle = "#0095DD";
  context.fill();
  context.closePath();
}

function drawPaddle() {
  context.beginPath();
  context.rect(
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight
  );
  context.fillStyle = "#016d0d";
  context.fill();
  context.closePath();
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        context.beginPath();
        context.rect(brickX, brickY, brickWidth, brickHeight);
        context.fillStyle = "#751f0e";
        context.fill();
        context.closePath();
      }
    }
  }
}

// *
//This function will set a timer to cause the interface to "blink". (This will be used when a life is lost.)
function blink() {
  var f = document.getElementById("myCanvas");
  setTimeout(function() {
    f.style.display = f.style.display == "none" ? "" : "none";
  }, 50);
  setTimeout(function() {
    f.style.display = f.style.display == "none" ? "" : "none";
  }, 200);
}

//this is where the magic happens
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  // *
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      dx += random(-3, 3); // (min,max) values from the random() function
    } else {
      lives--;
      if (lives === 2 || lives === 1) {
        blink();
      }
      if (!lives) {
        alert("GAME OVER" + "\n" + "\n" + "YOUR SCORE: " + score);
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = dx;
        dy = dy;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  x += dx;
  y += dy;

  //*
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 22;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 22;
  }
  requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + (brickWidth + 11) &&
          y > b.y &&
          y < b.y + (brickHeight + 11)
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          dx++;
          dy++;
          // *
          if (score == brickRowCount * brickColumnCount) {
            alert(
              "WINNER! CONGRATULATIONS! " + "\n" + "\n" + "YOUR SCORE: " + score
            );
            document.location.reload();
          }
        }
      }
    }
  }
}
// *
function drawScore() {
  context.font = "18px Lucida Console, Courier, monospace";
  context.fillStyle = "#016d0d";
  context.fillText("Score: " + score, 8, 20);
}
// *
function drawLives() {
  context.font = "18px Lucida Console, Courier, monospace;";
  context.fillStyle = "#016d0d";
  context.fillText("Lives: " + lives, canvas.width - 95, 20);
}

draw();
