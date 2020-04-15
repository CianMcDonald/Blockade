document.querySelector("a").addEventListener("click",play)
window.addEventListener('keydown', function(e) {
  if(e.keyCode == 38 && e.target == document.body || e.keyCode == 40 && e.target == document.body) {
    e.preventDefault();
  }
});
function play(){

  for (let p of document.querySelectorAll("a")){
    p.style.display = "none"
  }
  let canvas;
  let context;
  let width;
  let height;
  let player1;
  let player2;
  let puck;
  let interval;
  let bounce;
  let center1;
  let center2;
  let centerpuck;
  //document.addEventListener('DOMContentLoaded', init, false);
  init()
  function init() {
      canvas = document.querySelector('canvas');
      context = canvas.getContext('2d');
      width = canvas.width;
      height = canvas.height;
      player1 = {
        x: width/16,
        y: height/8*3,
        length: height/4,
        breadth: width/64,
        yChange: 0,
        up: false,
        down: false,
        score: 0
      }
      player2 = {
        x: width/16 * 15,
        y: height/8*3,
        length: height/4,
        breadth: width/64,
        yChange: 0,
        up: false,
        down: false,
        score: 0
      }
      puck = {
        x: width/2,
        y: height/2,
        size: width/40,
        xChange: -4,
        yChange: 0,
      }
      window.addEventListener('keydown', activate, false);
      window.addEventListener('keyup', deactivate, false);
      context.font = "100px Monaco"
      interval = window.setInterval(draw, 20);

  }

  function draw(){
    context.clearRect(0,0,width,height);
    collisions()
    //score on the top
    let score = player1.score + " - " + player2.score
    context.strokeText(score, width/32*13, height / 5.33333);
    //move Player1 and Player2 up and down
    if (player1.up == true){
      player1.yChange = -2
    }
    if (player1.down == true){
      player1.yChange = 2
    }
    if (player2.up == true){
      player2.yChange = -2
    }
    if (player2.down == true){
      player2.yChange = 2
    }
    puck.x += puck.xChange;
    puck.y += puck.yChange
    player1.y += player1.yChange;
    player2.y += player2.yChange;
    context.fillStyle = "#B084CC";
    context.fillRect(player1.x,player1.y,player1.breadth, player1.length);
    context.fillRect(player2.x,player2.y,player2.breadth, player2.length);
    context.fillStyle = "#7CC6FE";
    context.fillRect(puck.x,puck.y,puck.size,puck.size);
    //end
    if (player1.score == 5){
      stop("Player 1")
    }else if (player2.score == 5){
      stop("Player 2")
  }

  }

  function activate(event){
    if (event.keyCode == 87){
      player1.up = true
    }else if (event.keyCode == 83){
      player1.down = true
    }else if (event.keyCode == 38){
      player2.up = true
    }else if (event.keyCode == 40){
      player2.down = true
    }
  }
  function deactivate(event){
    if (event.keyCode == 87){
      player1.up = false
      player1.yChange = 0
    }else if (event.keyCode == 83){
      player1.down = false
      player1.yChange = 0
    }else if (event.keyCode == 38){
      player2.up = false
      player2.yChange = 0
    }else if (event.keyCode == 40){
      player2.down = false
      player2.yChange = 0
    }
  }
  function collisions(){
    //dont allow player to go past edge
    if (player1.y <= 0){
      player1.up = false
      player1.yChange = 0
    }
    if (player1.y + player1.length >= height){
      player1.down = false
      player1.yChange = 0
    }
    if (player2.y <= 0){
      player2.up = false
      player2.yChange = 0
    }
    if (player2.y + player2.length >= height){
      player2.down = false
      player2.yChange = 0
    }
    //collisions with each player
    center1 = player1.y + player1.length/2;
    center2 = player2.y + player2.length/2;
    centerpuck = puck.y + puck.size/2;
    //player1
    if (puck.x <= player1.x + player1.breadth && puck.x >= player1.x){
      if (puck.y + puck.size >= player1.y && puck.y <= player1.y + player1.length){
          puck.yChange = (centerpuck - center1) * 0.05
          puck.xChange *= -1
      }
    }
    //player2
    if (puck.x + puck.size >= player2.x && puck.x + puck.size <= player2.x + player2.breadth){
      if (puck.y + puck.size >= player2.y && puck.y <= player2.y + player2.length){
          puck.yChange = (centerpuck - center2) * 0.05
          puck.xChange *= -1
      }
    }
    //puck deflect off top
    if (puck.y <= 0){
      puck.yChange *= -1
    }
    if (puck.y + puck.size >= height){
      puck.yChange *= -1
    }
    //hits the ends
    //left
    if (puck.x <= 0 ){
      player2.score ++;
      scored();
    }
    //right
    if (puck.x + puck.size >= width){
      player1.score ++;
      scored();
    }
  }
  function scored(){
    puck.x = width/2;
    puck.y = height/2;
    if (puck.xChange > 0){
      puck.xChange = 4;
    }else{
      puck.xChange = -4;
    }
    puck.yChange = 0;
    player1.y = height/8*3;
    player2.y = height/8*3;
  }
  function stop(winner){
      window.removeEventListener('keydown', activate, false);
      window.removeEventListener('keyup', deactivate, false);
      clearInterval(interval);
      context.clearRect(0,0,width,height);
      let fin = "The winner is " + winner;
      context.strokeText(fin, 0, height /2);
      let main = document.querySelector("main");
      let new_p = document.createElement("p");
      new_p.innerHTML = "Play Again?";
      new_p.className = "button";
      main.appendChild(new_p).addEventListener("click",play);
  }
}
