function createPlayer(mark) {
  getMark = function() {
    return mark
  }

  return {
    getMark
  }
}

let player1 = createPlayer("X") 
let player2 = createPlayer("O")
console.log(player2.getMark())

let board = (function() {
  let noMarkValue = null
  let height = 3
  let width = 3
  let boardArray = []

  // boars shold be [
  // [1,2,3]
  // [4,5,6]
  // [7,8,9]

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
  }

  setCell = (x, y, mark) => {
    boardArray[x][y] = mark
  }

  return {
    printBoard,
    initBoard
  }

})()

board.initBoard()
board.printBoard()