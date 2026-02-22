const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
let canvas_width_and_heght = 500
canvas.width = canvas_width_and_heght
canvas.height = canvas_width_and_heght
let blockSize = canvas_width_and_heght / 25
let blockInWidth = canvas.width / blockSize;
let blockInHeight = canvas.height / blockSize;
let appleInGame = false
let direction = "left"
let gameIsStart = false;
let intervalGameId = null;
let scores = 0
const button = document.getElementById("gameButton")
function Block (x,y) {
  this.x = x
  this.y = y
}
function appleBlock (x,y) {
  this.x = x
  this.y = y
}

function Snake () {
  this.segment = [
    new Block(5 * blockSize,7 * blockSize),//head
    new Block(6 * blockSize,7 * blockSize),
    new Block(7 * blockSize,7 * blockSize),
    new Block(8 * blockSize,7 * blockSize)
  ]
}
function Apple () {
  this.part = []
}
Apple.prototype.getXY = function () {
  if(appleInGame) { 
    return;
  } else {
    appleInGame = true
    this.part.push(new appleBlock(Math.floor(Math.random() * 25) * blockSize,Math.floor(Math.random() * 25) * blockSize))
  }

}
Apple.prototype.checkCollision = function (snake) {
  let head = snake.segment[0]; // Голова змійки
  for (let h = 0; h < this.part.length; h++) {
    if (head.x === this.part[h].x && head.y === this.part[h].y) {
      scores++;
      this.part.splice(h, 1);
      appleInGame = false; // Дозволяємо створити нове яблуко
      
      // Щоб змійка росла, додаємо сегмент (копію хвоста)
      let tail = snake.segment[snake.segment.length - 1];
      snake.segment.push(new Block(tail.x, tail.y));
    }
  }
};
Apple.prototype.draw = function () {
  for(let r = 0; r < this.part.length; r++) {
    ctx.beginPath()
    ctx.fillStyle = "green"
    ctx.arc(this.part[r].x + blockSize / 2,this.part[r].y + blockSize / 2,blockSize / 2, 0, Math.PI * 2)
    
    ctx.fill()
    ctx.fillStyle = "black"
  }
}
Snake.prototype.draw = function () {
  ctx.fillStyle = "red"
  for (let g =1; g < this.segment.length; g++ )  {
    let x = this.segment[g].x ;
    let y = this.segment[g].y ;
    ctx.fillStyle = "red"
    ctx.fillRect(x, y, blockSize, blockSize)
    ctx.fillStyle = "black"
    ctx.strokeRect(x, y, blockSize, blockSize)
  }
  ctx.fillStyle = "red"
  let x = this.segment[0].x
  let y = this.segment[0].y
  ctx.fillRect(x,y,blockSize,blockSize)
  
  ctx.fillStyle = "black"
  ctx.strokeRect(x, y, blockSize, blockSize)
  if (direction === "left") {
    ctx.fillRect(x + blockSize / 5,y + blockSize / 5, blockSize / 5, blockSize / 5)
    ctx.fillRect(x + blockSize / 5,y + blockSize * 0.6, blockSize / 5, blockSize / 5)
  }
  if (direction === "right") {
    ctx.fillRect(x + blockSize * 0.6,y + blockSize / 5, blockSize / 5, blockSize / 5)
    ctx.fillRect(x + blockSize * 0.6,y + blockSize * 0.6, blockSize / 5, blockSize / 5)
  }
   if (direction === "up") {
     ctx.fillRect(x + blockSize / 5,y + blockSize / 5, blockSize / 5, blockSize / 5)
     ctx.fillRect(x + blockSize * 0.6,y + blockSize / 5, blockSize / 5, blockSize / 5)
   }
  if (direction === "down") {
    ctx.fillRect(x + blockSize / 5,y + blockSize * 0.6, blockSize / 5, blockSize / 5)
    ctx.fillRect(x + blockSize * 0.6,y + blockSize * 0.6, blockSize / 5, blockSize / 5)
   }
  ctx.fillStyle = "red"
}

Snake.prototype.move = function() {
  if (direction === "left") {
    this.segment.unshift(new Block(this.segment[0].x - blockSize,this.segment[0].y))
    this.segment.pop()
  } else if (direction === "right") {
    this.segment.unshift(new Block(this.segment[0].x + blockSize,this.segment[0].y))
    this.segment.pop()
  } else if (direction === "up") {
    this.segment.unshift(new Block(this.segment[0].x,this.segment[0].y - blockSize))
    this.segment.pop()
  } else /*down*/{
    this.segment.unshift(new Block(this.segment[0].x,this.segment[0].y + blockSize ))
    this.segment.pop()
  }
}
Snake.prototype.checkCollision = function () {
  for (let h = 0;h < this.segment.length;h++) {
    if (this.segment[h].x < 0 ) {
      this.segment[h].x = (blockInWidth - 1) * blockSize
    }
    if (this.segment[h].x > canvas.width ) {
      this.segment[h].x = 0
    }
    if (this.segment[h].y < 0 ) {
      this.segment[h].y = (blockInWidth - 1) * blockSize
    }
    if (this.segment[h].y > canvas.height ) {
      this.segment[h].y = 0
    }
  }
}
function startGame () {
  if (gameIsStart === false) {
    $("#gameButton").text("Finish game")
    gameIsStart = true
    let V = document.querySelector('input[name = "V" ]:checked')
    let snake = new Snake()
    let apple = new Apple()
    intervalGameId = setInterval(() => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      snake.draw()
      snake.move()
      snake.checkCollision()
      
      apple.getXY()
      apple.checkCollision(snake)
      apple.draw()
      $("#scores").text(scores)
    },V.value)
  } else {
    $("#gameButton").text("Start game")
    gameIsStart = false
    appleInGame = false
    clearInterval(intervalGameId)
    direction = "left"
    ctx.clearRect(0,0,canvas.width,canvas.height)
    scores = 0
  }
}
document.getElementById("gameButton").addEventListener("click",startGame)
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    direction = "up"
  } else if (event.key === "ArrowDown"){
    direction = "down"
  } else if (event.key === "ArrowRight"){
    direction = "right"
  } else if (event.key === "ArrowLeft"){
    direction = "left"
  } else {

  }
})
