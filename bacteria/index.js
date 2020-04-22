const canvas = document.getElementById('canvas')
const canvasWidth = canvas.width
const canvasHeight = canvas.height
const ctx = canvas.getContext('2d')
const camera = {
  zoom: 0.8,
  x: canvasWidth / 2,
  y: canvasHeight / 2,
}

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
    return circles.flatMap(circle => {
      if (circle.radius < 1) return []

      const dx = Math.cos(circle.direction) / (10 + circle.radius) * 50
      const dy = Math.sin(circle.direction) / (10 + circle.radius) * 50
      const distanceMoved = Math.sqrt(square(dx) + square(dy))
      const givesBirth = circle.radius > 10 && Math.random() < 0.002 * distanceMoved
      const newRadius = Math.max(0, 0
        + circle.radius
        + intersectedMines(circle, state.mines) * efficiency(circle)
        - death(circle)
        - battleDamage(circle, circles))
        - (givesBirth ? circle.radius * 0.2 : 0)

      const dradius = newRadius - circle.radius
      const newDirection = circle.direction + (dradius * 0.2)

      return [
        {
          ...circle,
          direction: newDirection,
          radius: newRadius,
          life: circle.life - distanceMoved,
          x: circle.x + dx,
          y: circle.y + dy,
        },
        ...maybeChild(givesBirth, circle)
      ]
    })
  }))
}

function initialState() {
  return {
    circles: arrayOfLength(100).map(_ => {
      return {
        x: Math.random() * 800,
        y: Math.random() * 800,
        direction: randomAngle(),
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

function maybeChild(givesBirth, circle) {
  if (!givesBirth) return []

  const angle = randomAngle()
  return [
    {
      x: circle.x + Math.cos(angle) * circle.radius * 1.2,
      y: circle.y + Math.sin(angle) * circle.radius * 1.2,
      direction: angle,
      life: 2000, // + Math.random() * 1000,
      radius: circle.radius * 0.2,
      color: circle.color,
    }
  ]
}

function randomAngle() {
  return Math.random() * 2 * Math.PI
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
  return life < 0 ? life * -0.01 : 0
}

function battleDamage(warrior, enemies) {
  return enemies.reduce((total, enemy) => {
    if (ratio(warrior.radius, enemy.radius) < 3 && circlesIntersect(warrior, enemy)) {
      return total + 0.1
    } else {
      return total
    }
  }, 0)
}

function ratio(a, b) {
  if (a > b) return a / b
  return b / a
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
  return drawArc(ctx, center, radius, color, 1)
}

function drawArc(ctx, center, radius, color, fraction) {
  const [x, y] = cameraTransformPoint(center)
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.arc(x, y, cameraTransformScalar(radius), 0, 2 * Math.PI * fraction, false)
  ctx.stroke()
}

function drawSquare(ctx, center, width, color) {
  const [x, y] = cameraTransformPoint(center)
  ctx.fillStyle = color
  const offset = cameraTransformScalar(width / 2)
  ctx.fillRect(x - offset, y - offset, cameraTransformScalar(width), cameraTransformScalar(width))
}

function randomColor() {
  return '#' + [1, 2, 3]
    .map(_ => Math.floor(Math.random() * 16))
    .map(_ => _.toString(16))
    .join('')
}

function cameraTransformPoint([x, y]) {
  return [
    (x - camera.x) * camera.zoom + canvasWidth / 2,
    (y - camera.y) * camera.zoom + canvasWidth / 2
  ]
}

function cameraTransformScalar(x) {
  return x * camera.zoom
}


function arrayOfLength(length, contents=1) {
  const result = []
  for (let i = 0; i < length; i++) {
    result.push(contents)
  }
  return result
}
