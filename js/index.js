$(document).ready(function() {
  var $breakTime = $("#break-time")
  var $sessionTime = $("#session-time")
  var counter = 0
  var sessionLength
  var breakLength
  var interval
  var ding = "http://www.chiptape.com/chiptape/sounds/medium/Taito_Carousel.wav"
  var audio = new Audio(ding) //use this audio to notify when timer is off
  var playIconUni = '\u25B7'
  var pauseIconUni = '\u2758 \u2758'
  var isOnBreak = false
  var oneSecond = 100

  $("#break-minus, #break-plus, #session-minus, #session-plus").click(
    function() {
      endSession(false)
      preCanvas()
      if (this.id === "break-minus" && $breakTime.html() > 0) {
        $breakTime.html(parseInt($breakTime.html()) - 1)
      } else if (this.id === "break-plus") {
        $breakTime.html(parseInt($breakTime.html()) + 1)
      } else if (this.id === "session-minus" && $sessionTime.html() > 0) {
        $sessionTime.html(parseInt($sessionTime.html()) - 1)
        preCanvas()
      } else if (this.id === "session-plus" && $sessionTime.html() < 60) {
        $sessionTime.html(parseInt($sessionTime.html()) + 5)
        preCanvas()
      }
    }
  )

  function convert2Sec(s) {
    var min = Math.floor(s / 60)
    var sec = s % 60
    sec = sec < 10 ? "0" + sec : sec //add extra "0" if sec has just 1 digit
    if (s > 3600) {
      var hour = Math.floor(s / 3600)
      return hour + ":" + min + ":" + sec
    }
    return min + ":" + sec
  }

  var preCanvas = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "#ccc"
    ctx.beginPath()
    ctx.arc(200, 200, 150, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fillText(playIconUni, 200, 180)
    ctx.fillText(convert2Sec($sessionTime.html() * 60), 200, 230)
  }

  var canvas = document.getElementById("canvas")
  var ctx = canvas.getContext("2d")
  ctx.lineWidth = 18
  ctx.font = "45px 'Open Sans Condensed', sans-serif"
  ctx.fillStyle = "#FDFFFC"
  ctx.textAlign = "center"
  ctx.shadowColor = "#4ecece"
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2
  ctx.shadowBlur = 5
  preCanvas()

  var draw = function(radius, timeLength, color) {
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.arc(
      200,
      200,
      radius,
      1.5 * Math.PI,
      (Math.PI * timeLength) / 30 + 1.5 * Math.PI
    )
    ctx.stroke()
  }

  function drawClock(min, sec, minColor, secColor) {
    draw(120, min, minColor)
    draw(150, sec, secColor)
  }

  function onBreak() {
    isOnBreak = true
    counter++
    breakLength = $breakTime.html() * 60
    var remainingTime = breakLength - counter
    var min = Math.floor(remainingTime / 60)
    var sec = remainingTime % 60
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillText(convert2Sec(remainingTime), 200, 230)
    ctx.fillText("BREAK!", 200, 180)

    drawClock(min, sec, "#136a2d", "#d888ac")

    if (breakLength === counter) {
      return endSession()
    }
  }

  function endSession(auto = true) {
    clearInterval(interval)
    counter = 0
    isOnBreak = false
    preCanvas()
    if (auto === true) {
      audio.play()
    }
  }

  function pause() {
    clearInterval(interval)
    interval = undefined
    ctx.clearRect(125, 130, 150, 60)
    ctx.fillText(playIconUni, 200, 180)
  }

  function startSession() {
    counter++
    sessionLength = $sessionTime.html() * 60 //convert minute to second
    if (sessionLength <= 0) return
    var remainingTime = sessionLength - counter
    var hour = Math.floor(remainingTime / 3600)
    var min = Math.floor(remainingTime / 60)
    var sec = remainingTime % 60

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillText(pauseIconUni, 200, 180)
    ctx.fillText(convert2Sec(remainingTime), 200, 230) //show remaining time on canvas

    drawClock(min, sec, "#e07fac", "#ffe2ef")

    if (sessionLength === counter) {
      endSession()
      interval = setInterval(onBreak, oneSecond)
    }
  }

  $("#canvas").click(function() {
    if (interval === undefined || counter === 0) {
      if (isOnBreak) {
        return interval = setInterval(onBreak, oneSecond)
      } else {
        return interval = setInterval(startSession, oneSecond)
      }
    } else {
      return pause()
    }
  })
})
