import { clearScreenDown, createInterface } from 'node:readline';
import chalk from 'chalk';
import { brotliDecompress } from 'node:zlib';

let player1Mark = "X"
let player2Mark = "O"
let rlInput = process.stdin
let rlOutput = process.stdout

let log = (function () {
  let log = console.log

  let info = function(message) {
    log(chalk.blueBright(message))
  }

  let debug = function(message) {
    log(chalk.magentaBright(message))
  }

  let error = function(message) {
    log(chalk.redBright(message))
  }

  return {
    info, debug, error
  }
})()


function createPlayer(mark) {
  let getMark = function() {
    return mark
  }

  return {
    getMark
  }
}

let createBoard = function() {
  const _noMarkValue = null
  const _height = 3
  const _width = 3
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
    // log.debug({x,y})
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
    log.debug("");
    cells.forEach((row) => {
      console.log(row);
    })
    log.debug("");
  }
  
  let setCellByCellNum = function(cellNum, mark) {
    _setCell({..._getXAndYFromCellNum(cellNum), mark})
  }


  let getCells = () => cells.map(arr => [...arr])
  let getHeight = () => _height
  let getWidth = () => _width
    
  _init()

  return {
    printBoard,
    setCellByCellNum,
    getCells,
    getHeight,
    getWidth
  }
}

let consoleIOController = (function(rlInput, rlOutput) {
  const rl = createInterface({
    input: rlInput,
    output: rlOutput,
  });
  
  let promptUser = (message, inputHandler) => {
    rl.question(chalk.blueBright(message), inputHandler)
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
  let winner = false
  let board = createBoard()
  
  let start = () => {
    log.info("Welcome to Odin Tic-tac-toe!")
    playRound()
  }
  
  let playRound = function() {
    log.info("----------")
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
      log.error(error.message)
      playRound()
      return
    }
    _flipPlayerTurn()
    determineWinner()
    if (!winner) {
      playRound()
      return
    }
    consoleIOController.terminate()
    log.info("congrats!")
  }

  let determineWinner = function() {
    log.debug("determineWinner start")
    let cells = board.getCells()
    let bWidth = board.getWidth(), bHeight = board.getHeight()
    let winnerFound = false

    let getWinner = () => player1Turn ? "Player 1" : "Player 2"
    
    let computeWinner = function(groups) {
      for(const group of groups) { 
        let markCounts = group.reduce(
          (acc, ele) => {
            if (ele === null) return acc
            acc[ele] === undefined ? acc[ele] = 1 : acc[ele] += 1
            return acc
          },
          {}
        )
        if (Math.max(...Object.values(markCounts)) >= group.length) {
          return true
        }
      }
      return false
    }
    // win conditions
    // straight horizontal line
    if (computeWinner(cells)) {
      winner = getWinner()
    }
    
    // log.debug(`straight horizontal line winner found ${winnerFound}`)

    // straight vertical lines
    let groupsVertical = []
    for(let col_i = 0; col_i < board.getWidth(); col_i++) {
      let col = []
      for (let row_i = 0; row_i < board.getHeight(); row_i++) {
        col.push(cells[row_i][col_i])
      }
      groupsVertical.push(col) 
    }
    winnerFound = computeWinner(groupsVertical)
    if (computeWinner(cells)) {
      winner = getWinner()
    }
    // log.debug(`straight vertical line winner found ${winnerFound}`)
    
    // diagonal line (top left to bottom right)
    let groupsDiag = []
    let diag = []
    for(let i = 0; i < bWidth; i++) {
      diag.push(cells[i][i])
    }
    groupsDiag.push(diag)
    
    // diagonal line (bottom left to top right)
    diag = []
    for(let i = 0, j = bHeight - 1; i < bWidth && j < bHeight; i++, j--) {
      diag.push(cells[j][i])
    }
    groupsDiag.push(diag)
    
    winnerFound = computeWinner(groupsDiag)
    if (computeWinner(cells)) {
      winner = getWinner()
    }
    // log.debug(`diagonal line winner found ${winnerFound}`)
    
    // final checking
    log.debug(`winnerFound : ${winnerFound}`)
  }

  let _flipPlayerTurn = () => player1Turn = !player1Turn
  let _currentPlayerMark = () => player1Turn ? player1.getMark() : player2.getMark()

  return {
    start
  }
  
})(player1Mark, player2Mark)

game.start()