import { createInterface } from 'node:readline';

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
  let cells = []
  
  let _init = function() {
    cells = []
    for(let i = 0; i < _height; i++) {
      let row = []
      for(let j = 0; j < _width; j++) {
        row.push(_noMarkValue)
      }
      cells.push(row)
    }
  }
  
  let _getXAndYFromCellNum = function(cellNum) {
    let conv1BasedTo0Based = 0
    let x = Math.floor(cellNum / _width) - conv1BasedTo0Based
    let y = cellNum % _height - conv1BasedTo0Based
    log({x,y})
    return {x, y}
    
  }
  
  let _setCell = function({x, y, mark}) {
    if (cells[x] === undefined || cells[x][y] === undefined) {
      throw Error("You have chosen an invalid cell!")
    }
    if (cells[x][y] !== null) {
      throw Error("Cell already has a mark!")
    }
    cells[x][y] = mark
  }
  
  let printBoard = function() {
    log("");
    cells.forEach((row) => {
      log(row);
    })
    log("");
  }
  
  let setCellByCellNum = function(cellNum, mark) {
    _setCell({..._getXAndYFromCellNum(cellNum), mark})
  }

  let getCells = function () {
    return cells.map((arr) => {
      return [...arr]
    })
  }
    
  _init()

  return {
    printBoard,
    setCellByCellNum,
    getCells
  }
}

let consoleIOController = (function(rlInput, rlOutput) {
  const rl = createInterface({
    input: rlInput,
    output: rlOutput,
  });
  
  let promptUser = (message, inputHandler) => {
    rl.question(message, inputHandler)
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
    playRound()
  }
  
  let playRound = function() {
    log("----------")
    board.printBoard()
    let message = `Player ${player1Turn ? "1" : "2"}'s turn, where would you `
      + `like to put your ${_currentPlayerMark()} mark?\n`;
    consoleIOController.promptUser(message, inputHandler)
  }

  let inputHandler = function(input) {
    try {
      board.setCellByCellNum(parseInt(input), _currentPlayerMark())
    }
    catch (error) {
      log(error.message)
      playRound()
      return
    }
    _flipPlayerTurn()
    determineWinner()
    if (!winnerFound) {
      playRound()
      return
    }
    consoleIOController.terminate()
    log("congrats!")
  }

  let determineWinner = function() {
    let cells = board.getCells()

    let winnerFound = false
    // win conditions
    // straight horizontal line
    cells.forEach( (row) => {
      let first = row[0]
      for(let i = 1; i < row.length; i++) {
        let cell = row[i]
        if ((cell === undefined) || (cell === null) || (cell !== first)) {
          return
        }
      }
      winnerFound = true

    })
    log(`winnerFound : ${winnerFound}`)
    // straight vertical line
    // diagonal line (both ways)
  }

  let _flipPlayerTurn = function() {
    player1Turn = !player1Turn
  }

  let _currentPlayerMark = function () {
    return player1Turn ? player1.getMark() : player2.getMark()
  }

  return {
    start
  }
  
})(player1Mark, player2Mark)

game.start()