let canvas;
let context;
let width;
let height;
let board = [];
let number = 42;
let x = 0;
let y = 0;
let size = 12.5;
let num_dead;
let num_live;
document.addEventListener('DOMContentLoaded', init, false);
function createBoard(){
  for (let j = 0; j < number-1; j++){
    board.push([])
    for (let i = 0; i < number-1 ; i++){
      board[j].push(0)
    }
  }
}
function init() {
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;
    createBoard();
    for (let j = 1; j < board.length-1; j++){
      x = 0;
      for (let i = 1; i < board[j].length -1 ; i++){
          board[j][i] = randomNum();
          if (board[j][i] === 1){
              context.fillStyle = "#7CC6FE";
              context.fillRect(x,y,size,size);
          }else if (board[j][i] === 0){
              context.fillStyle = "#FFFFFF";
              context.fillRect(x,y,size,size);
          }
          x += size;
      }
      y += size;
    }
  window.setInterval(draw, 200);
}
function draw(){
    // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    // Any live cell with two or three live neighbours lives on to the next generation.
    // Any live cell with more than three live neighbours dies, as if by overpopulation.
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    for (let row = 1; row < board.length-1; row++){
      for (let col = 1; col < board[row].length-1; col++){
        let result = checkRound(col,row);
        num_dead = result[0];
        num_live = result[1];
        if (board[col][row] === 0){
          if (num_live === 3){
            board[col][row] = 1;
          }
        }else{
          if (num_live < 2){
            board[col][row] = 0;
          }else if (num_live > 3){
            board[col][row] = 0;
          }
        }
      }
    }
    boardy(board);
}
function randomNum(){
    return Math.floor(Math.random()*2);
}
function checkRound(col, row){
    num_dead = 0;
    num_live = 0;
    // to the right
    if (board[col][row + 1] === 0){
      num_dead += 1;
    }else{
      num_live += 1;
    }
    // to the left
    if (board[col][row - 1] === 0){
      num_dead += 1;
    }else{
      num_live += 1;
    }
    //to the top
    if (board[col + 1][row] === 0){
      num_dead += 1;
    }else{
      num_live += 1;
    }
    //to the bottom
    if (board[col - 1][row] === 0){
      num_dead += 1;
    }else{
      num_live += 1;
    }
    //top right
    if (board[col + 1][row + 1] === 0){
      num_dead += 1;
    }else{
      num_live += 1;
    }
    //top left
    if (board[col + 1][row - 1] === 0){
      num_dead += 1;
    }else{
      num_live += 1;
    }
    //bottom left
    if (board[col - 1][row - 1] === 0){
      num_dead += 1;
    }else{
      num_live += 1;
    }
    //bottom right
    if (board[col - 1][row + 1] === 0){
      num_dead += 1;
    }else{
      num_live += 1;
    }
    return [num_dead, num_live];
}
function boardy(board){
  x = 0;
  y = 0;
  for (let j = 1; j < board.length-1; j++){
    x = 0;
    for (let i = 1; i < board[j].length -1 ; i++){
        if (board[j][i] === 1){
            context.fillStyle = "#7CC6FE";
            context.fillRect(x,y,size,size);
        }else if (board[j][i] === 0){
            context.fillStyle = "#FFFFFF";
            context.fillRect(x,y,size,size);
        }
        x += size;
    }
    y += size;
  }
}
