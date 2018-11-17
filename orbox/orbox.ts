// --- Classes ---

/**
 * An interface for anything with x and y components
 *
 * @param x The x component of the vector
 * @param y The y component of the vector
 */
interface Point {
  x: number
  y: number
}

/**
 * Vector class for vector math.
 */
class Vector implements Point {
  x: number
  y: number
  /**
   * Create a new custom Vector.
   *
   * @param x The x component of the vector
   * @param y The y component of the vector
   */
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
  /**
   * Alias for new Vector(x, y)
   *
   * @param  x The x component of the vector
   * @param  y The y component of the vector
   *
   * @return Vector{x, y}
   */
  static new (x: number, y: number): Vector {
    return new Vector(x, y)
  }
  /**
   * Add vectors together
   *
   * @param  ...vectors The vectors to sum
   *
   * @return The resultant vector
   */
  static add(...vectors: Vector[]): Vector {
    let resultantVector = Vector.origin
    vectors.forEach(vector => {
      resultantVector.x += vector.x
      resultantVector.y += vector.y
    })
    return resultantVector
  }
  /**
   * A new origin vector
   *
   * @return The origin vector, (0, 0)
   */
  static get origin () {
    return new Vector(0, 0)
  }
  /**
   * Non-static version of {@link Vector.add}.
   *
   * @param ...vectors The vectors to add to this vector
   */
  plus(...vectors: Vector[]): void {
    let resultantVector = Vector.add(...[new Vector(this.x, this.y),
      ...vectors])
    this.x = resultantVector.x
    this.y = resultantVector.y
  }
}

/**
 * Class for positions of GameObjects
 */
class Position extends Vector {
  /**
   * Move the position
   *
   * @param  x Units to move in the x direction
   * @param  y Units to move in the y direction
   */
  move(vector: Vector): void {
    this.plus(vector)
  }
  /**
   * Move the position in just the x direction
   *
   * @param  x Units to move
   */
  moveX(x: number): void {
    console.log(this.x)
    this.move(new Vector(x, 0))
    console.log(this.x)
  }
  /**
   * Move the position in just the y direction
   *
   * @param y Units to move
   */
  moveY(y: number): void {
    this.move(new Vector(0, y))
  }
  /**
   * Move left
   *
   * @param units Units to move left
   */
  moveLeft(units: number): void {
    this.moveX(-units)
  }
  /**
   * Move up
   *
   * @param units Units to move up
   */
  moveUp(units: number): void {
    this.moveY(-units)
  }
  /**
   * Move down
   *
   * @param units Units to move down
   */
  moveDown(units: number): void {
    this.moveY(units)
  }
  /**
   * Move right
   *
   * @param units Units to move right
   */
  moveRight(units: number): void {
    this.moveX(units)
  }
}

class GameObject {
  /**
   * A position vector
   */
  pos: Position
  /**
   * A render function. Takes Position as only argument.
   */
  renderFunction: Function
  /**
   * Create a new GameObject
   *
   * @param pos A position vector for the object's position
   * @param render A function that takes a position vector as an argument and
   * renders the GameObject.
   */
  constructor(pos: Position, render: Function = (pos: Position) => {}) {
    this.pos = pos
    this.renderFunction = render
  }
  /**
   * Renders the GameObject.
   */
  render(): void {
    this.renderFunction(this.pos)
  }
  move(vector: Vector) {
    this.pos.move(vector)
    if (this.pos.x < 0) {
      this.pos.x = 0
    } else if (this.pos.x > canvas.width - units) {
      this.pos.x = canvas.width - units
    }
    if (this.pos.y < 0) {
      this.pos.y = 0
    } else if (this.pos.y > canvas.height - units) {
      this.pos.y = canvas.height - units
    }
  }
}

class Rectangle extends GameObject {
  width: number
  height: number
  constructor(pos: Position, width: number, height: number, context, stroke, fill) {
    super(pos, pos => {
      drawRect(context, stroke, fill, pos, width, height)
    })
    this.width = width
    this.height = height
  }
}

enum ArrowKey {
  Left = 'ArrowLeft',
  Down = 'ArrowDown',
  Up = 'ArrowUp',
  Right = 'ArrowRight'
}

// --- Constants ---

/**
 * The background color of the canvas
 */
const backgroundColor = '#7777ff'
/**
 * The primary color for the player. This is the color of the box.
 */
const playerColor1 = 'blue'
/**
 * The secondary color for the player. This the color for player effects.
 */
const playerColor2 = 'yellow'
/**
 * Constant for game units to pixels conversion
 */
const units = 20;
const fps = 1000 / 30
const ups = 1000 / 30
console.log(fps)

// --- Main ---

function render (objects: GameObject[]) {
  // requestAnimationFrame(() => { render(objects) })
  context.clearRect(0, 0, canvas.width, canvas.height)
  objects.forEach(object => {
    object.render()
  })
}

function drawRect (context: CanvasRenderingContext2D, stroke, fill, pos: Point, width, height) {
  context.beginPath()
  context.strokeStyle = stroke
  context.fillStyle = fill
  context.rect(pos.x, pos.y, width, height)
  context.strokeRect(pos.x, pos.y, width, height)
  context.fill()
  context.stroke()
}

function drawLine (context: CanvasRenderingContext2D, stroke, start: Point, end: Point, width: number = -1) {
  context.strokeStyle = stroke
  if (width > 0) context.lineWidth = width
  context.beginPath()
  context.moveTo(start.x, start.y)
  context.lineTo(end.x, end.y)
  context.stroke()
}

/**
 * The game canvas
 */
let canvas: HTMLCanvasElement = document.querySelector('#canvas')
/**
 * The context for the game canvas
 */
let context = canvas.getContext('2d')
let gameObjects: GameObject[] = []


// Make the canvas background
let background = new Rectangle(new Position(0, 0), canvas.width, canvas.height, context, backgroundColor, backgroundColor)
gameObjects.push(background)

// Add the player box
let player = new Rectangle(new Position(5 * units, 6 * units), units, units, context, playerColor1, backgroundColor)
gameObjects.push(player)

// Add obstacles
gameObjects.push(new Rectangle(new Position(8 * units, 6 * units), units, units, context, 'black', 'black'))
gameObjects.push(new Rectangle(new Position(0 * units, 6 * units), units, units, context, 'black', 'black'))
gameObjects.push(new Rectangle(new Position(1 * units, 2 * units), units, units, context, 'black', 'black'))
gameObjects.push(new Rectangle(new Position(5 * units, 5 * units), units, units, context, 'black', 'black'))

player.move = (vector: Vector) => {
  if (this.pos.x > 0 && vector.x < 0) {
    
  }
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case ArrowKey.Left:
      player.move(Vector.new(-units, 0))
      break
    case ArrowKey.Up:
      player.move(Vector.new(0, -units))
      break
    case ArrowKey.Down:
      player.move(Vector.new(0, units))
      break
    case ArrowKey.Right:
      player.move(Vector.new(units, 0))
      break
  }
})

setInterval(render, fps, gameObjects)
