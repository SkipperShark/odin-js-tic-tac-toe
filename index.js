import { createInterface } from 'node:readline';
import { Readline } from 'node:readline/promises';
import { cachedDataVersionTag } from 'node:v8';


let player1Mark = "X"
let player2Mark = "O"
let rlInput = process.stdin
let rlOutput = process.stdout

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
    _boardArray.forEach((row) => {
      log(row);
    })
    log("\n");
  }
  
  let setCell = (x, y, mark) => {
    console.log("setCell");
    console.log(_boardArray[x][y]);
    if (_boardArray[x][y] === undefined) {
      throw Error("You have chosen an invalid cell!")
    }
    _boardArray[x][y] = mark
  }
    
  _init()
  return {
    printBoard,
    setCell
  }
}


let consoleIOController = (function(rlInput, rlOutput) {
  const rl = createInterface({
    input: rlInput,
    output: rlOutput,
  });
  
  // let promptUser = (message, validInputHandler) => {
  //   rl.question(message, (input) => {
  //     let index = parseInt(input)
  //     if (index > 0 && index <= 9) {
  //       validInputHandler(index)
  //       terminate()
  //     } else {
  //       log("Please input a number between (inclusive) 1 and 9")
  //       promptUser("")
  //     }
  //   })
  // }
  let promptUser = (message, inputHandler) => {
    rl.question(message, inputHandler)
    // rl.question(message, (input) => {
    //   return inputHandler(input)
    //   try {
    //     return inputHandler(input)
    //   }
    //   catch (error) {
    //     if(error instanceof RangeError) {
          
    //     }
    //   }
    // })
  }

  let terminate = () => {
    rl.close()
  }

  return {
    promptUser,
    terminate
  }

})(rlInput, rlOutput)


let game = (function(player1Mark, player2Mark) {
  let player1 = createPlayer(player1Mark) 
  let player1Turn = true
  let player2 = createPlayer(player2Mark)
  let winnerFound = false
  let board = createBoard()
  
  let start = () => {
    log("Welcome to Odin Tic-tac-toe!")
    board.printBoard()
    playRound()
  }
  
  let playRound = function() {
    let message = ""
    if (player1Turn) {
      message = `Player 1's turn, where would you like to put your ${player1.getMark()} mark?\n`
    } else {
      message = `Player 2's turn, where would you like to put your ${player2.getMark()} mark?\n`
    } 
    consoleIOController.promptUser(message, inputHandler)
    // let index = consoleIOController.promptUser(message, fnInputValid)
    // log("success")
    // let mark = player1Turn ? player1.getMark() : player2.getMark()
    // log("test")
    // board.setCell(index, mark)
    // log("a")
    // player1Turn = !player1Turn
    // if (winnerFound === false) {
    //   log("a")
    //   playRound()
    // }
  }

  // let fnInputValid = function(input) {
  //   let index = parseInt(input)
  //   if (index > 0 && index <= 9) {
  //     return true
  //   }
  //   return false
  // }

  let inputHandler = function(input) {
    let index = parseInt(input)
    if (!(index > 0 && index <= 9)) {
      let message = "Please input a number between (inclusive) 1 and 9\n"
      // throw new RangeError(message)
      input = consoleIOController.promptUser(message, inputHandler)
    }
    log({index})
    return index
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
