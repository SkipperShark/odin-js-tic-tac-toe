import { type } from 'node:os';
import { createInterface } from 'node:readline';

let player1Mark = "X"
let player2Mark = "O"

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// function promptUserForInput(strMessage, fnInputHandler) {
//   rl.question(strMessage, input => {
//     fnInputHandler(input)
//     rl.close();
//   });
// }

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
  
  let playRound = function() {
    let message = ""
    if (player1Turn) {
      message = `Player 1's turn, where would you like to put your ${player1.getMark()} mark?\n`
    } else {
      message = `Player 2's turn, where would you like to put your ${player2.getMark()} mark?\n`
    } 
    promptUserForInput(message, (index) => {
      log({player1Turn, index})
      let mark = player1Turn ? player1.getMark() : player2.getMark()
      board.setCell(index, mark)
      player1Turn = !player1Turn
      playRound()
    })
  }

  let start = () => {
    log("Welcome to Odin Tic-tac-toe!")
    board.printBoard()
    playRound()
    
  }
  
  let promptUserForInput = (message, validInputHandler) => {
    rl.question(message, (input) => {
      let index = parseInt(input)
      // let typeOfIndex = typeof index
      // log({index, typeOfIndex})
      if (index > 0 && index <= 9) {
        validInputHandler(index)
        rl.close()
      } else {
        log("Please input a number between (inclusive) 1 and 9")
        promptUserForInput("")
      }
    })
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


// let test = "X"
// console.log(parseInt(test))