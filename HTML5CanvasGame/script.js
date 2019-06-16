// I have added an asterix" * " above the code I have added or changed.
// I have changed certain values throughout.

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var canvasHeightRatio = 0.8;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleHeight = 12;
var paddleWidth = 120;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 4;
var brickColumnCount = 5;
var brickWidth = 80;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 40;
var brickOffsetLeft = 20;
var score = 0;
var lives = 3;
var scrollValue = 100;
var paused = true;

canvas.height = canvas.width * canvasHeightRatio;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
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

// *
// resets paddle position based on mouse movement
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (
    relativeX > paddleWidth / 2 - 10 &&
    relativeX < canvas.width - paddleWidth / 2 + 10
  ) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

//*
window.addEventListener("keydown", pauseGameKeyHandler, false);

//*
// Key handler to activate pause function once key is pressed
function pauseGameKeyHandler(e) {
  var keyCode = e.keyCode;
  switch (keyCode) {
    case 80: //p
      togglePause();
      break;
  }
}

//*
// pause function
function togglePause() {
  paused = !paused;
  draw();
}

//*
function pauseText() {
  context.font = "18px Lucida Console, Courier, monospace";
  context.fillStyle = "#016d0d";
  context.textAlign = "center";
  context.fillText(
    "PAUSED (PRESS 'P' to RESUME)",
    canvas.width / 2,
    canvas.height / 2
  );
}

//* add a div on the page (used for the golden brick bonus)
function addElement() {
  var newDiv = document.createElement("div");
  var newContent = document.createTextNode("+2 LIVES!");
  newDiv.appendChild(newContent);
  newDiv.setAttribute("id", "bonus");
  var existingDiv = document.getElementById("myCanvas");
  document.body.insertBefore(newDiv, existingDiv);
}

//* remove the added div (used for the golden brick bonus)
function removeElement() {
  var target = document.getElementById("bonus");
  target.remove();
}

// detects collision with bricks
function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      //* added golden brick variable gb
      var gb = bricks[2][2];
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

          //* increase lives by 2 if the ball is inside the golden brick position
          if (
            x > gb.x &&
            x < gb.x + (brickWidth + 11) &&
            y > gb.y &&
            y < gb.y + (brickHeight + 11)
          ) {
            //text appears showing the bonus
            lives += 2;
            // show the visual for it
            addElement();
            //make the visual dissappear
            setTimeout(removeElement, 1500);
          }

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
// This function generates a random integer between "min and max" - it's what puts the 'silly' in silly ball.
const random = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

// ball
function drawBall() {
  context.beginPath();
  context.arc(x, y, ballRadius, 0, Math.PI * 2);
  context.fillStyle = "#0095DD";
  context.fill();
  context.closePath();
}

// paddle
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

// bricks grid
function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        if (bricks[2][2].status == 1) {
          context.beginPath();
          context.rect(
            2 * (brickWidth + brickPadding) + brickOffsetLeft,
            2 * (brickHeight + brickPadding) + brickOffsetTop,
            brickWidth,
            brickHeight
          );
          context.fillStyle = "#a89201";
          context.fill();
          context.closePath();
        }
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
// This function will set a timer to cause the interface to "blink". (This will be used when a life is lost.)
function blink() {
  setTimeout(function() {
    canvas.style.display = canvas.style.display == "none" ? "" : "none";
  }, 50);
  setTimeout(function() {
    canvas.style.display = canvas.style.display == "none" ? "" : "none";
  }, 200);
}
// score
function drawScore() {
  context.font = "18px Lucida Console, Courier, monospace";
  context.fillStyle = "#016d0d";
  context.textAlign = "center";
  context.fillText("Score: " + score, canvas.width / 9, canvas.height / 17);
}
// lives
function drawLives() {
  context.font = "18px Lucida Console, Courier, monospace;";
  context.fillStyle = "#016d0d";
  context.textAlign = "center";
  context.fillText("Lives: " + lives, canvas.width / 1.12, canvas.height / 17);
}

// this is where the magic happens
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
      dy = -dy - 1;
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
        // resets position of ball
        x = canvas.width / 2;
        y = canvas.height - 30;
        // *
        // flips direction of ball
        dx = -dx;
        dy = -dy;
        // resets position of paddle
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  x += dx;
  y += dy;

  // *
  // controls left/right keys for paddle
  if (rightPressed && paddleX < canvas.width - (paddleWidth + 10)) {
    paddleX += 15;
  } else if (leftPressed && paddleX > 11) {
    paddleX -= 15;
  }
  if (paused) {
    pauseText();
  } else {
    requestAnimationFrame(draw);
  }
}

draw();
