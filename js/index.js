$(document).ready(function() {
 var $breakTime = $("#break-time");
 var $sessionTime = $("#session-time");
 var counter = 0;
 var sessionLength;
 var breakLength;
 var interval;
 var ding = "http://www.chiptape.com/chiptape/sounds/medium/Taito_Carousel.wav";
 var audio = new Audio(ding); //use this audio to notify when timer is off
  
$("#break-minus, #break-plus, #session-minus, #session-plus").click(function() {
  if (this.id === "break-minus" && $breakTime.html() > 0) {
    $breakTime.html(parseInt($breakTime.html()) - 1);
  }
  else if (this.id === "break-plus") {
    $breakTime.html(parseInt($breakTime.html()) + 1);
  }
  else if (this.id === "session-minus" && $sessionTime.html() > 0) {
    $sessionTime.html(parseInt($sessionTime.html()) - 1);
    preCanvas();
  }
  else if (this.id === "session-plus") {
    $sessionTime.html(parseInt($sessionTime.html()) + 1);
   preCanvas();
  }
  
});
  var preCanvas = function() {
     ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#ccc";
    ctx.beginPath();
    ctx.arc(200,200,150, 0, 2*Math.PI);
    ctx.stroke();
    ctx.fillText("Click to Start", 200, 180);
    ctx.fillText($sessionTime.html(), 200, 230);
  }
  
  function convertSec(s) {
    var min = Math.floor(s / 60);
    var sec = s % 60;
    sec = sec < 10 ? "0" + sec: sec; //add extra "0" if sec has just 1 digit
    if (s > 3600) {
      var hour = Math.floor(s / 3600);
      return hour + ":" + min + ":" + sec;
    }
    return min + ":" +  sec;
  }
  
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
  ctx.lineWidth = 18;
  ctx.font = "45px 'Open Sans Condensed', sans-serif";
  ctx.fillStyle = "#FDFFFC";
  ctx.textAlign = "center";
  ctx.shadowColor = "#4ecece";
  ctx.shadowOffsetX = 2; 
  ctx.shadowOffsetY = 2; 
  ctx.shadowBlur = 20;
 preCanvas();
  
var draw = function(radius, timeLength, color) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(200,200,radius, 1.5*Math.PI, Math.PI*timeLength/30 + 1.5*Math.PI);
        ctx.stroke();
      }


  $("#canvas").click(function() {
  if (!interval) {  //if the timer is not running
    interval = setInterval(timeIt, 1000); //trigger the timer
    function timeIt() {
    counter++;
    sessionLength = $sessionTime.html() * 60; //convert minute to second
    var time = sessionLength - counter;
    var hour = Math.floor(time / 3600);
    var min = Math.floor(time / 60);
    var sec = time % 60;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(convertSec(time),200,230); //show remaining time on canvas
      
      draw(120,min,"#e07fac");
      draw(150,sec,"#ffe2ef");
    
    if (sessionLength === counter) {
      clearInterval(interval);
      audio.play(); //play audio
      counter = 0;
      interval = setInterval(timeIt2, 1000);
  }
    function timeIt2() {
        counter++;
        breakLength = $breakTime.html() *60;
        var time = breakLength - counter;
        var min = Math.floor(time / 60);
        var sec = time % 60;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText(convertSec(time),200,230);
        ctx.fillText("BREAK!",200,180);
        draw(120,min,"#136a2d");
        draw(150,sec,"#d888ac");
        
    if (breakLength === counter) {
          clearInterval(interval);
          counter = 0;
          audio.play();
          interval = setInterval(timeIt, 1000);
        }
      }
  };
  } else {
      clearInterval(interval);
      counter = 0;
      interval = false;
    }
}); //end of click event function
});