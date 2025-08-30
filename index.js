import { createInterface } from 'node:readline';

let player1Mark = "X"
let player2Mark = "O"

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptUserForInput(strMessage, fnInputHandler) {
  rl.question(strMessage, input => {
    fnInputHandler(input)
    rl.close();
  });
}

function log(message) {
  console.log(message);
}

function createPlayer(mark) {
  let getMark = function() {
    return mark
  }

  return {
    getMark
  }
}

let createBoard = function() {
  let _noMarkValue = null
  let _height = 3
  let _width = 3
  let _boardArray = []

  let _init = function () {
    _boardArray = []
    for(let i = 0; i < _height; i++) {
      let row = []
      for(let j = 0; j < _width; j++) {
        row.push(_noMarkValue)
      }
      _boardArray.push(row)
    }
  }
  
  let printBoard = () => {
    _boardArray.forEach( (row) => {
      log(row);
    })
    log("\n");
  }

  let setCell = (x, y, mark) => {
    if (_boardArray.length != _height) {
      throw Error("board height invalid, did you initialize the board?")
    }

    _boardArray.forEach( (row) => {
      if (row.length != _width) {
        throw Error("board width invalid, did you initialize the board?")
      }
    })

    if (_boardArray[x][y] != undefined) {
      return
    }

    _boardArray[x][y] = mark
  }

  _init()

  return {
    printBoard,
    setCell
  }
  
}

let game = (function(player1Mark, player2Mark) {
  let player1 = createPlayer(player1Mark) 
  let player1Turn = true
  let player2 = createPlayer(player2Mark)
  let winner = null

  let board = createBoard()
  
  let playRound = () => {
    if (player1Turn) {
      
      log(`Player 1's turn, where would you like to put your ${player1.getMark()} mark?`)
    } else {
      log(`Player 1's turn, where would you like to put your ${player2.getMark()} mark?`)
    }
  }

  let start = () => {
    log("Welcome to Odin Tic-tac-toe!")
    board.printBoard()
    playRound()

  }


  return {
    start
  }
  
})(player1Mark, player2Mark)

game.start()

// const rl = createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });
// rl.question(`What's your name?`, name => {
//   console.log(`Hi ${name}!`);
//   rl.close();
// });