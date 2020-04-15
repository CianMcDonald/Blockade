document.addEventListener("DOMContentLoaded", user);

let username;
let sid;
let res;
let request;
let url;
let header_p;
let guest = false;

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
  if (guest == true){
    document.querySelector(".button ").style.display = "none"
  }else if (guest == false){
    for (let but of document.querySelectorAll(".button + .button")){
      but.style.display = "none"
    }
  }
}
