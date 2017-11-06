let options = [ "Test" ]

var startAngle = 0

let finishFunction = () => {}

function setOnFinish (fn) {
  finishFunction = fn
}

function getArc () {
  return Math.PI / (options.length / 2)
}

let spinTimeout = null

var spinArcStart = 10
var spinTime = 0
var spinTimeTotal = 0

var ctx

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF"
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1)
}

function RGB2Color(r,g,b) {
  return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b)
}

function getColor(item, maxitem) {
  const phase = 0
  const center = 128
  const width = 127
  const frequency = Math.PI*2/maxitem

  const red = Math.sin(frequency*item+2+phase) * width + center
  const green = Math.sin(frequency*item+0+phase) * width + center
  const blue = Math.sin(frequency*item+4+phase) * width + center

  return RGB2Color(red,green,blue)
}

function drawRouletteWheel() {
  var canvas = document.getElementById("canvas")
  if (canvas.getContext) {
    var outsideRadius = 200
    var textRadius = 160
    var insideRadius = 0

    ctx = canvas.getContext("2d")
    ctx.clearRect(0,0,500,500)

    ctx.strokeStyle = "black"
    ctx.lineWidth = 2

    ctx.font = 'bold 12px Helvetica, Arial'

    for(let i = 0; i < options.length; i++) {
      var angle = startAngle + i * getArc()
      //ctx.fillStyle = colors[i]
      ctx.fillStyle = getColor(i, options.length)

      ctx.beginPath()
      ctx.arc(250, 250, outsideRadius, angle, angle + getArc(), false)
      ctx.arc(250, 250, insideRadius, angle + getArc(), angle, true)
      // ctx.stroke()
      ctx.fill()

      ctx.save()
      ctx.shadowOffsetX = -1
      ctx.shadowOffsetY = -1
      ctx.shadowBlur    = 0
      ctx.shadowColor   = "rgb(220,220,220)"
      ctx.fillStyle = "black"
      ctx.translate(250 + Math.cos(angle + getArc() / 2) * textRadius,
                    250 + Math.sin(angle + getArc() / 2) * textRadius)
      ctx.rotate(angle + getArc() / 2 + Math.PI / 2)
      var text = options[i]
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0)
      ctx.restore()
    }

    //Arrow
    ctx.fillStyle = "black"
    ctx.beginPath()
    ctx.moveTo(250 - 4, 250 - (outsideRadius + 5))
    ctx.lineTo(250 + 4, 250 - (outsideRadius + 5))
    ctx.lineTo(250 + 4, 250 - (outsideRadius - 5))
    ctx.lineTo(250 + 9, 250 - (outsideRadius - 5))
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 13))
    ctx.lineTo(250 - 9, 250 - (outsideRadius - 5))
    ctx.lineTo(250 - 4, 250 - (outsideRadius - 5))
    ctx.lineTo(250 - 4, 250 - (outsideRadius + 5))
    ctx.fill()
  }
}

function spin() {
  const spinAngleStart = Math.random() * 10 + 10
  let spinTime = 0
  const spinTimeTotal = Math.random() * 3 + 4 * 1000
  rotateWheel(spinAngleStart, spinTime, spinTimeTotal)
}

function rotateWheel(spinAngleStart, spinTime, spinTimeTotal) {
  spinTime += 30
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel()
    return
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal)
  startAngle += (spinAngle * Math.PI / 180)
  drawRouletteWheel()
  spinTimeout = setTimeout(rotateWheel.bind(null, spinAngleStart, spinTime, spinTimeTotal), 30)
}

function stopRotateWheel() {
  clearTimeout(spinTimeout)
  var degrees = startAngle * 180 / Math.PI + 90
  var arcd = getArc() * 180 / Math.PI
  var index = Math.floor((360 - degrees % 360) / arcd)
  ctx.save()
  ctx.font = 'bold 30px Helvetica, Arial'
  var text = options[index]
  if (finishFunction) finishFunction(index, text)
  // ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10)
  ctx.restore()
}

function easeOut(t, b, c, d) {
  var ts = (t/=d)*t
  var tc = ts*t
  return b+c*(tc + -3*ts + 3*t)
}

function setOptions (newOptions) {
  options = newOptions
}

module.exports = { drawRouletteWheel, spin, setOptions, setOnFinish }
