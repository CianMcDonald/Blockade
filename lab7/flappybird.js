document.querySelector("a").addEventListener("click",play)
document.addEventListener("DOMContentLoaded", user);
let username;
let sid;
let res;
let request;
let request2;
let request3;
let url;
let url2
let url3
let header_p;
let guest = false;
let game = 'flappybird';

window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});
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

function play(){
  for (let p of document.querySelectorAll("a")){
    p.remove()
  }
  let canvas;
  let context;
  let width;
  let height;
  let bird;
  let col;
  let columns = [];
  let interval;
  let spaceDown = false;
  let death;
  let lastfunc = 0;
  let score = 0;

  init()
  function init() {
      canvas = document.querySelector('canvas');
      context = canvas.getContext('2d');
      width = canvas.width;
      height = canvas.height;
      //bird object
      bird ={
          x: height / 4,
          y: width / 2,
          size: height/20,
          yChange : -1,
      }
      context.font = "100px Monaco"
      window.addEventListener('keydown', activate, false);
      window.addEventListener('keyup', deactivate, false);
      canvas.addEventListener('mousedown', activate, false);
      canvas.addEventListener('mouseup', deactivate, false);
      interval = window.setInterval(draw, 40);
  }
  function draw(){
      context.clearRect(0,0,height,width);
      context.fillStyle = "#7CC6FE";
      context.fillRect(bird.x, bird.y, bird.size, bird.size);
      if (death == true){
        stop()
        return;
      }
      col = {
        x: width,
        y: 0,
        gap: height / 8 * 2,
        width: height / 10.667,
        height: getRandomNumber(height/8, height/8 * 6 ),
        xChange: width / 160,
      }
      //waiting to print second column
      if (columns.length < 1){
        columns.push(col);
      }
      if (columns.length < 2 && columns[0].x <= width/2){
        columns.push(col);
      }
      for (let cols of columns){
          if (cols.x + cols.width <= 0){
              cols.x = width;
              cols.height = getRandomNumber(height/8, height/8 * 6 );
          }
          //drawing columns
          collisions(cols);
          //score
          if (bird.x >= cols.x + cols.width -2 && bird.x <= cols.x + cols.width +2){
              score ++;
          }
          context.fillStyle = "#B084CC";
          context.fillRect(cols.x, cols.y, cols.width, cols.height);
          context.fillRect(cols.x, cols.height + cols.gap, cols.width, height - cols.height + cols.gap);

          cols.x -= cols.xChange;
      }
      context.strokeText(score, width/2, height / 5.33333)
      //stops being able to spam space or hold it
      if (lastfunc == 0){
        if (spaceDown == true){
          spaceDown = false;
          bird.yChange = -25;
          lastfunc = 1;
        }
        if (spaceDown == false){
          bird.y += bird.yChange;
          bird.yChange += 3;
        }
      }else{
        bird.y += bird.yChange;
        bird.yChange += 3;
      }
  }
  function collisions(cols) {
      //check if the bird is after hitting the bottom
      if (bird.y >= height) {
          death = true;
      }
      //check collisions between bird and columns
      //bird and side of columns
      if (bird.x + bird.size > cols.x && bird.x < cols.x + cols.width) {
          if (bird.y < cols.height || bird.y + bird.size > cols.height + cols.gap) {
              death = true;
          }//bird and top edge of col and bot edge
      }
  }
  function stop(){
      window.removeEventListener('keydown', activate, false);
      window.removeEventListener('keyup', deactivate, false);
      canvas.removeEventListener('mousedown', activate, false);
      canvas.removeEventListener('mouseup', deactivate, false);
      clearInterval(interval);
      context.clearRect(0,0,width,height);
      let fin = "Your Score: " + score;
      context.strokeText(fin, width/8, height /2);
      let main = document.querySelector("section");
      let new_p = document.createElement("a");
      new_p.innerHTML = "Play Again?";
      new_p.className = "button";
      main.appendChild(new_p).addEventListener("click",play);
      if (guest == false){
        url3 = 'score_store.py?game=' + game + '&sid=' + sid + '&score=' + score ;
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
  function getRandomNumber(min, max){
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function activate(event){
      if (event.keyCode === 32 || event.button === 0){
        spaceDown = true;
      }
  }
  function deactivate(event){
    if (event.keyCode === 32 || event.button === 0){
        spaceDown = false;
        lastfunc = 0;
    }
  }
}
