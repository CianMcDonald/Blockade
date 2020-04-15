document.querySelector("a + a").addEventListener("click",play2)
document.addEventListener("DOMContentLoaded", user);
let username;
let sid;
let res;
let request;
let request2;
let request3;
let url;
let url2;
let url3;
let header_p;
let guest = false;
let game = 'pong';
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function user(){
  if (document.querySelectorAll("header p").length == 0){
    sid = getCookie('sid')
    if (sid == ""){
      guest = true;
      username = ""
      displayUser();
    }
    if (guest == false){
      url = 'getuser.py?sid=' + sid;
      request = new XMLHttpRequest();
      request.addEventListener('readystatechange', handle_response, false);
      request.open('GET', url, true);
      request.send(null);
    }
  }
  url2 = 'getleaderboard.py?game=' + game;
  request2 = new XMLHttpRequest();
  request2.addEventListener('readystatechange', getleaderboard, false);
  request2.open('GET', url2, true);
  request2.send(null);
}
function handle_response(){
    if (request.readyState === 4) {
          // Check the request was successful
          if (request.status === 200) {
            res = request.responseText.trim()
            if (res === 'failure' ){
                // not logged in
                username = ""
                guest = true
            }else{
                // logged in
                res = res.split(" ")
                username = res[1]
            }
          }
        displayUser()
    }
}
function displayUser(){
  if (username == ""){
    header_p = document.createElement("p");
    header_p.innerHTML = "Welcome Guest";
  }else{
    header_p = document.createElement("p");
    header_p.innerHTML = "Welcome "+username
  }
  document.querySelector("header").appendChild(header_p)
}
function getleaderboard(){
  if (request2.readyState === 4){
        // Check the request was successful
        if (request2.status === 200){
          document.querySelector("aside section").innerHTML = request2.responseText
        }
      }
}
function play2(){
  for (let a of document.querySelectorAll("a")){
    a.remove()
  }
  let time = 0;
  let canvas;
  let context;
  let width;
  let height;
  let player1;
  let player2;
  let puck;
  let interval;
  let bounce = 0;
  let center1;
  let center2;
  let centerpuck;
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
        xChange: -5,
        yChange: 0,
      }
      window.addEventListener('keydown', activate, false);
      window.addEventListener('keyup', deactivate, false);
      context.font = "100px Monaco"
      interval = window.setInterval(draw, 20);
      //remove movement for player 2
      //must auto move player 2 so it follows puck

  }

  function draw(){
    time += 0.02;
    context.clearRect(0,0,width,height);
    center1 = player1.y + player1.length/2;
    center2 = player2.y + player2.length/2;
    centerpuck = puck.y + puck.size/2;
    //player2 movement

    if (centerpuck < center2 - puck.size ){
      player2.up = true;
      player2.down = false;
    }else if(centerpuck > center2 + puck.size ){
      player2.up = false;
      player2.down = true;
    }else{
      player2.up = false;
      player2.down = false;
    }
    collisions()
    //score on the top
    let score = player1.score + " - " + player2.score;
    context.strokeText(score, width/32*13, height / 5.33333);

    context.strokeText(Math.floor(time), width/2 - 25, height - 5)
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
      stop("Paul")
  }

  }

  function activate(event){
    if (event.keyCode == 87){
      player1.up = true
    }else if (event.keyCode == 83){
      player1.down = true
    }
  }
  function deactivate(event){
    if (event.keyCode == 87){
      player1.up = false
      player1.yChange = 0
    }else if (event.keyCode == 83){
      player1.down = false
      player1.yChange = 0
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

    //player1
    if (puck.x <= player1.x + player1.breadth && puck.x >= player1.x){
      if (puck.y + puck.size >= player1.y && puck.y <= player1.y + player1.length){
          puck.yChange = (centerpuck - center1) * 0.05
          puck.xChange *= -1
      }
    }
    //player2
    if (puck.x + puck.size >= player2.x && puck.x + puck.size <= player2.x + player2.breadth ){
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
      context.strokeText(Math.floor(time), width/2 - 25, height - 5)
      let main = document.querySelector("main section");
      let new_p = document.createElement("a");
      new_p.innerHTML = "Play Again?";
      new_p.className = "button";
      new_p.style.width = "20%";
      main.appendChild(new_p).addEventListener("click",play2);
      if (guest == false && winner == 'Player 1'){
        url3 = 'score_store.py?game=' + game + '&sid=' + sid + '&score=' + Math.floor(time);
        request3 = new XMLHttpRequest();
        request3.addEventListener('readystatechange', setscore, false);
        request3.open('GET', url3, true);
        request3.send(null);
      }
  }
  function setscore(){
    if (request3.readyState === 4) {
          // Check the request was successful
          if (request3.status === 200) {
            res = request3.responseText.trim()
            if (res === 'failure' ){
                // database problem
                let error_p = document.createElement("p");
                error_p.innerHTML = "Problem occured while storing your score"
            }else if (res === 'success'){
                // fetch new leaderboard
                user()
            }
          }
    }
  }
}
