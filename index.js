//create canvas
let canvas = document.getElementById("canvas");
console.log(canvas);
canvas.focus();
let context = canvas.getContext("2d");
let canvasWidth = 600;
let canvasHeight = 400;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
context.fillStyle = "black";

//block dimensions
let width = 16;
let height = 80;
let block1 = [0, canvasHeight/2-40];
let block2 = [canvasWidth-16, canvasHeight/2-40];
let block1Dir = 0;
let block2Dir = 0;

//ball position
let ballX = 200;
let ballY = 200;
let ballYDir = 1;
let ballXDir = 1;

//audio bites
let player1boop = document.getElementById("player1boop");
let player2boop = document.getElementById("player2boop");
let winboop = document.getElementById("winboop");
let pop = document.getElementById("pop");

//initialize game loop and state
let loop;
let running = 0;

//initialize timeout functions
let timeout1;
let timeout2;

//draw every 2 milliseconds
function newGame() {
  winboop.pause();
  winboop.currentTime = 0;
  document.getElementById("startDiv").style.display = "none";
  if (timeout1 !== undefined) {
    clearTimeout(timeout1);
  }
  if (timeout2 !== undefined) {
    clearTimeout(timeout2);
  }
  timeout1 = setTimeout(() => {
    speed+=0.25;
    timeout2 = setTimeout(() => {
      speed+=0.25;
    }, 20000);
  }, 20000)
  running = 1;
  loop = setInterval(draw, 2);
}

//listen to controls - W and S for player 1, up and down arrows for player 2, R for restart
window.addEventListener("keydown", function(e) {
  switch(e.key) {
    case "f":
      if (running === 0) {
        reset();
      }
      break;
    case "r":
      if (running === 0) {
        reset();
      }
      break;
    case "w":
      block1Dir = -1;
      break;
    case "s":
      block1Dir = 1;
      break;
    case "ArrowUp":
      block2Dir = -1;
      break;
    case "ArrowDown":
      block2Dir = 1;
      break;
    default:
      break;
  }
});

document.addEventListener("keyup", function(e) {
  if (e.key === "w" || e.key === "s") {
    block1Dir = 0;
  }
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    block2Dir = 0;
  }
});

let winDiv = document.getElementById("winDiv");
let winText = document.getElementById("winText");

//ball movement speed and starting angle
let speed = 1.6;
let angle = 15;

//main game loop
function draw() {
  if (running === 0) {
    return;
  }
  /*if (Math.abs(angle) % 90 === 0) {
    if (ballXDir === 0 && ballYDir === 0) {
      angle+=10;
    } else if (ballXDir === 0 && ballYDir === 1) {
      angle-=10;
    } else if (ballXDir === 1 && ballYDir === 0) {
      angle-=10;
    } else if (ballXDir === 1 && ballYDir === 1) {
      angle+=10;
    }
  }*/
  let radians = angle*Math.PI/180;
  let xunits = Math.cos(radians) * speed;
  let yunits = Math.sin(radians) * speed;
  if (block1[1] > 2 && block1[1] < canvas.height-82) {
    block1[1]+=block1Dir*2;
  } else if (block1[1] <= 2) {
    block1[1]++;
  } else {
    block1[1]--;
  }
  if (block2[1] > 2 && block2[1] < canvas.height-82) {
    block2[1]+=block2Dir*2;
  } else if (block2[1] <= 2) {
    block2[1]++;
  } else {
    block2[1]--;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(...block1, width, height);
  context.fillRect(...block2, width, height);
  context.strokeStyle = "black";
  context.lineWidth = 1;
  context.beginPath();
  context.arc(ballX, ballY, 10, 0, 2 * Math.PI);
  context.stroke();
  context.fill();
  let rightpixel = context.getImageData(ballX+11, ballY, 1, 1);
  let leftpixel = context.getImageData(ballX-11, ballY, 1, 1);
  if (rightpixel.data[3] === 255 && ballXDir === 1) {
    ballXDir = 0;
    player1boop.play();
    let dif = Math.round(Math.abs(ballY - block2[1]));
    //console.log(dif, angle);
    if (dif <= 10 && dif > 0) {
      angle+=20;
    } else if (dif > 10 && dif <= 20) {
      angle+=15;
    } else if (dif > 20 && dif <= 30) {
      angle+=10;
    } else if (dif > 30 && dif <= 40) {
      angle+=5;
    } else if (dif > 40 && dif <= 50) {
      angle-=5
    } else if (dif > 50 && dif <= 60) {
      angle-=10;
    } else if (dif > 60 && dif <= 70) {
      angle-=15;
    } else if (dif > 70 && dif <= 80) {
      angle-=20;
    }
  }
  if (leftpixel.data[3] === 255 && ballXDir === 0) {
    ballXDir = 1;
    player2boop.play();
    let dif = Math.round(Math.abs(ballY - block1[1]));
    console.log(dif, angle);
    if (dif <= 10 && dif > 0) {
      angle+=30;
    } else if (dif > 10 && dif <=20) {
      angle+=20;
    } else if (dif > 20 && dif <= 30) {
      angle+=10;
    } else if (dif > 30 && dif <= 50) {
      angle=angle;
    } else if (dif > 50 && dif <= 60) {
      angle-=10;
    } else if (dif > 60 && dif <= 70) {
      angle-=20;
    } else if (dif > 70 && dif <= 80) {
      angle-=30;
    }
  }
  if (ballYDir === 1) {
    ballY-=yunits;
  } else {
    ballY+=yunits;
  }
  if (ballXDir === 1) {
    ballX+=xunits;
  } else {
    ballX-=xunits;
  }
  if (ballY >= canvas.height - 10) {
    angle = -angle;
    pop.play();
  }
  if (ballY <= 10) {
    angle = -angle;
    pop.play();
  }
  if (ballX >= canvas.width-10) {
    win("Player 1");
  }
  if (ballX <= 10) {
    win("Player 2");
  }
}

function win(player) {
  winDiv.style.display = "flex";
  winText.innerHTML = `${player} wins!`;
  clearInterval(loop);
  running = 0;
  winboop.play();
}

//reset and start new game
function reset() {
  block1 = [0, canvasHeight/2-40];
  block2 = [canvasWidth-16, canvasHeight/2-40];
  speed = 1.6;
  ballX = 200;
  ballY = 200;
  ballYDir = 1;
  ballXDir = 1;
  angle = 0;
  winDiv.style.display = "none";
  newGame();
}

//newGame();
