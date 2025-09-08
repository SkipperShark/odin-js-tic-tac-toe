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
  let getNumCells = () => _width * _height
    
  _init()

  return {
    printBoard,
    getNumCells,
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
  let player2 = createPlayer(player2Mark)
  let player1Turn = true

  let board = createBoard()
  
  // let curTurn = 1
  // let maxNumTurns = board.getNumCells()
  
  let start = () => {
    log.info("Welcome to Odin Tic-tac-toe!")
    playRound()
  }
  
  let playRound = function() {
    console.log({curTurn, maxNumTurns});
    if (curTurn >= maxNumTurns) {
      _endGame({isTie: true})
      return
    }
    log.info("----------")
    board.printBoard()
    let message = `Player ${player1Turn ? "1" : "2"}'s turn, where would you `
      + `like to put your ${_curPlayer().mark} mark?\n`;
    consoleIOController.promptUser(message, _inputHandler)
  }

  let _inputHandler = function(input) {
    try {
      board.setCellByCellNum(parseInt(input), _curPlayer().mark)
      curTurn += 1
    }
    catch (error) {
      log.error(error.message)
      playRound()
      return
    }
    player1Turn = !player1Turn
    if (_winnerFound() === false) {
      playRound()
      return
    }
    _endGame()
  }

  let _winnerFound = function() {
    let cells = board.getCells()
    let bWidth = board.getWidth()
    let bHeight = board.getHeight()

    let computerWinner = function(groups) {
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
    if (computerWinner(cells) == true) {
      return true
    }

    // straight vertical lines
    let groupsVertical = []
    for(let col_i = 0; col_i < board.getWidth(); col_i++) {
      let col = []
      for (let row_i = 0; row_i < board.getHeight(); row_i++) {
        col.push(cells[row_i][col_i])
      }
      groupsVertical.push(col) 
    }
    if (computerWinner(cells) === true) {
      return true
    }
    
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
    
    if (computerWinner(cells) === true) {
      return true
    }

    return false
  }
  
  let _curPlayer = () => {
    return {
      mark: player1Turn ? player1.getMark() : player2.getMark(),
      name: player1Turn ? "Player 1" : "Player 2"
    }
  }
  let _endGame = ({isTie}) => {
    if (isTie) {
      consoleIOController.terminate()
      log.info(`Tie!, thanks for playing!`)
      return
    }
    log.info(`Winner found! Congrats ${_curPlayer().name}!`)
  }

  return {
    start
  }
  
})(player1Mark, player2Mark)

game.start()