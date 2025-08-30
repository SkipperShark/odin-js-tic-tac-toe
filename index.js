let player1Mark = "X"
let player2Mark = "O"

function createPlayer(mark) {
  getMark = function() {
    return mark
  }

  return {
    getMark
  }
}

let board = (function() {
  let noMarkValue = null
  let height = 3
  let width = 3
  let boardArray = []

  initBoard = () => {
    boardArray = []
    for(let i = 0; i < height; i++) {
      let row = []
      for(let j = 0; j < width; j++) {
        row.push(noMarkValue)
      }
      boardArray.push(row)
    }
  }
  
  printBoard = () => {
    boardArray.forEach( (row) => {
      console.log(row);
    })
    console.log("\n");
  }

  setCell = (x, y, mark) => {
    if (boardArray.length != height) {
      throw Error("board height invalid, did you initialize the board?")
    }

    boardArray.forEach( (row) => {
      if (row.length != width) {
        throw Error("board width invalid, did you initialize the board?")
      }
    })

    boardArray[x][y] = mark
  }

  return {
    printBoard,
    initBoard,
    setCell
  }
  
})()

let game = (function(player1Mark, player2Mark) {
  let player1 = createPlayer(player1Mark) 
  let player2 = createPlayer(player2Mark)


  
})(player1Mark, player2Mark)


// board.initBoard()
board.printBoard()
board.setCell(1,1, "X")
board.printBoard()