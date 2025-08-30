import { createInterface } from 'node:readline';

let player1Mark = "X"
let player2Mark = "O"

function createPlayer(mark) {
  let getMark = function() {
    return mark
  }

  return {
    getMark
  }
}

let createBoard = function() {
  let noMarkValue = null
  let height = 3
  let width = 3
  let boardArray = []

  let init = function () {
    boardArray = []
    for(let i = 0; i < height; i++) {
      let row = []
      for(let j = 0; j < width; j++) {
        row.push(noMarkValue)
      }
      boardArray.push(row)
    }
  }
  
  let printBoard = () => {
    boardArray.forEach( (row) => {
      console.log(row);
    })
    console.log("\n");
  }

  let setCell = (x, y, mark) => {
    if (boardArray.length != height) {
      throw Error("board height invalid, did you initialize the board?")
    }

    boardArray.forEach( (row) => {
      if (row.length != width) {
        throw Error("board width invalid, did you initialize the board?")
      }
    })

    if (boardArray[x][y] != undefined) {
      return
    }

    boardArray[x][y] = mark
  }

  init()

  return {
    printBoard,
    setCell
  }
  
}

let game = (function(player1Mark, player2Mark) {
  let player1 = createPlayer(player1Mark) 
  let player2 = createPlayer(player2Mark)

  let board = createBoard()
  board.printBoard()
  
})(player1Mark, player2Mark)


const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question(`What's your name?`, name => {
  console.log(`Hi ${name}!`);
  rl.close();
});