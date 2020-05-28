document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [
    'pink',
    'purple',
    'red',
    'green',
    'blue'
  ]

  const lTetro = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const zTetro = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const tTetro = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetro = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetro = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theTetro = [lTetro, zTetro, tTetro, oTetro, iTetro]

  let currentPosition = 4
  let currentRotation = 0

  let random = Math.floor(Math.random() * theTetro.length)
  let current = theTetro[0][0]

  function draw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetro')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  // undraw the tetro
  function undraw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetro')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  // timerId = setInterval(moveDown, 1000)

  function control (e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  function moveDown () {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  function freeze () {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetro.length)
      current = theTetro[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  function moveLeft () {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if (!isAtLeftEdge) currentPosition -= 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }

    draw()
  }

  //  move the tetris piece right, unless it's at the edge or there is a bloackage
  function moveRight () {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if (!isAtRightEdge) currentPosition += 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }

    draw()
  }

  // rotate the Tetro
  function rotate () {
    undraw()
    currentRotation++
    if (currentRotation === current.length) { // if current roation gets to 4, make it go back to 0
      currentRotation = 0
    }
    current = theTetro[random][currentRotation]
    draw()
  }

  //  show up-next tetro
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  // the tetro without rotations
  const upNextTetros = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetro
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetro
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetro
    [0, 1, displayWidth, displayWidth + 1], // oTetro
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]// iTetro

  ]

  function displayShape () {
    displaySquares.forEach(square => {
      square.classList.remove('tetro')
      square.style.backgroundColor = ''
    })
    upNextTetros[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetro')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  // add functionality to the button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * theTetro.length)
      displayShape()
      addScore()
    }
  })

  function addScore () {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetro')
          squares[index].style.backgroundColor = ''
        })
        const squareRemoved = squares.splice(i, width)
        squares = squareRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  //  games over
  function gameOver () {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }
})
