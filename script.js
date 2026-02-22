const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
let canvas_width_and_heght = 500
canvas.width = canvas_width_and_heght
canvas.height = canvas_width_and_heght
let blockSize = canvas_width_and_heght / 25
let blockInWidth = canvas.width / blockSize;
let blockInHeight = canvas.height / blockSize;

let direction = "left"
let gameIsStart = false;
let intervalGameId = null;
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
    intervalGameId = setInterval(() => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      snake.draw()
      snake.move()
      snake.checkCollision()

    },V.value)
  } else {
    $("#gameButton").text("Start game")
    gameIsStart = false
    clearInterval(intervalGameId)
    direction = "left"
    ctx.clearRect(0,0,canvas.width,canvas.height)
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