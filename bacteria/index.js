const canvas = document.getElementById('canvas')
const canvasWidth = canvas.width
const canvasHeight = canvas.height
const ctx = canvas.getContext('2d')

/* DO NOT TOUCH THIS CODE OR YOU WILL BE FIRED */
/* vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv */

requestAnimationFrame(onAnimationFrame)

let state = initialState()
function onAnimationFrame() {
  state = updateState(state)
  render(view(state))
  requestAnimationFrame(onAnimationFrame)
}

/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
/* DO NOT TOUCH THIS CODE OR YOU WILL BE FIRED */

function view(state) {
  return state
}

function updateState(state) {
  return $(state, atPath('circles', circles => {
    return circles.map(circle => {
      const dx = (Math.random() - 0.5) / circle.radius * 50
      const dy = (Math.random() - 0.5) / circle.radius * 50
      const distanceMoved = Math.sqrt(square(dx) + square(dy))
      return {
        ...circle,
        radius: Math.max(0, 0
          + circle.radius
          + intersectedMines(circle, state.mines) * efficiency(circle)
          - death(circle)
          - battleDamage(circle, circles)),
        life: circle.life - distanceMoved * 1,
        x: circle.x + dx,
        y: circle.y + dy,
      }
    })
  }))
}

function initialState() {
  return {
    circles: arrayOfLength(100).map(_ => {
      return {
        x: Math.random() * 800,
        y: Math.random() * 800,
        life: 2000, // + Math.random() * 1000,
        radius: Math.random() * 100,
        color: randomColor(),
      }
    }),
    mines: arrayOfLength(500).map(_ => {
      return {
        x: Math.random() * 800,
        y: Math.random() * 800,
      }
    })
  }
}

function intersectedMines(circle, mines) {
  return mines.reduce((count, mine) => {
    if (square(circle.x - mine.x) + square(circle.y - mine.y) <= square(circle.radius)) {
      return count + 1
    }
    return count
  }, 0)
}

function death({life}) {
  return life < 0 ? 1 : 0
}

function battleDamage(warrior, enemies) {
  return enemies.reduce((total, enemy) => {
    if (!circlesIntersect(warrior, enemy)) {
      return total + 0.01
    } else {
      return total
    }
  }, 0)
}

function efficiency({radius}) {
  return  1 / (1 + square(radius) / 100)
}

function square(x) {
  return x * x
}

function circlesIntersect(a, b) {
  const distance = Math.sqrt(square(a.x - b.x) + square(a.y - b.y))
  if (distance > a.radius + b.radius) return false
  if (distance < Math.abs(b.radius - a.radius)) return false
  return true
}

function render(view) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  view.circles.forEach(circle => {
    drawCircle(
      ctx,
      [circle.x, circle.y],
      circle.radius,
      circle.color)
    drawArc(
      ctx,
      [circle.x, circle.y],
      circle.radius,
      circle.color,
      circle.life / 2000)
  })
  view.mines.forEach(mine => {
    drawSquare(
      ctx,
      [mine.x, mine.y],
      5,
      '#080'
    )
  })
}

function drawCircle(ctx, center, radius, color) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI, false)
  ctx.stroke()
}

function drawArc(ctx, center, radius, color, fraction) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.arc(center[0], center[1], radius * 0.99, 0, 2 * Math.PI * fraction, false)
  ctx.stroke()
}

function drawSquare(ctx, center, width, color) {
  ctx.fillStyle = color
  ctx.fillRect(center[0] - width / 2, center[1] - width / 2, width, width)
}

function randomColor() {
  return '#' + [1, 2, 3]
    .map(_ => Math.floor(Math.random() * 16))
    .map(_ => _.toString(16))
    .join('')
}

function arrayOfLength(length, contents=1) {
  const result = []
  for (let i = 0; i < length; i++) {
    result.push(contents)
  }
  return result
}
