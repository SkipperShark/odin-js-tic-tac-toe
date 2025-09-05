import { clearScreenDown, createInterface } from 'node:readline';
import chalk from 'chalk';

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
  let winnerFound = false
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
    if (!winnerFound) {
      playRound()
      return
    }
    consoleIOController.terminate()
    log.info("congrats!")
  }

  let determineWinner = function() {
    log.debug("determineWinner start")
    let cells = board.getCells()

    let winnerFound = false
    
    let computeWinner = function(groups) {
      for(let i = 0; i < groups.length; i++) {
        let group = groups[i]
        let markCounts = {}

        for (let j = 0; j < group.length; j++) {
          let ele = group[j]
          if (ele !== null) {
            markCounts[ele] ? markCounts[ele] += 1 : markCounts[ele] = 1
          }
        }
        if (Math.max(...Object.values(markCounts)) >= group.length) {
          return true
        }
      }
      return false
    }

    // win conditions
    // straight horizontal line
    winnerFound = computeWinner(cells)
    log.debug(`straight horizontal line winner found ${winnerFound}`)
    // cells.forEach( (row) => {
    //   let markCounts = {}
    //   row.forEach(ele => {
    //     if (ele !== null) {
    //       markCounts[ele] === undefined ? markCounts[ele] = 1 : markCounts[ele] += 1
    //     }
    //   })
    //   if (Math.max(...Object.values(markCounts)) >= row.length) {
    //     winnerFound = true
    //   }
    // })

    // straight vertical lines
    // let cols = []
    // for(let row_i = 0; row_i < board.getWidth(); row_i++) {
    //   let col = []
    //   for (let col_i = 0; col_i < board.getHeight(); col_i++) {
    //     col.push(cells[row_i][col_i])
    //   }
    //   cols.push(col) 
    // }
    // console.log(cols)
    // let cols = []
    // let cols = cells.forEach( (row, rowIndex) => {
    //   for(let i = 0; i < cells.height; i++) {
        
    //   }
    //   row.forEach( (ele, eleIndex) => {

    //   })

    // })
    // let colArrays = cells.map( (row) => {
    //   for(let i = 0; i < row.length; i++) {
    //     colArrays[i] = row[i]
    //   }
    // })



    log.debug(`winnerFound : ${winnerFound}`)
    // diagonal line (both ways)
  }

  let _flipPlayerTurn = () => player1Turn = !player1Turn
  let _currentPlayerMark = () => player1Turn ? player1.getMark() : player2.getMark()

  return {
    start
  }
  
})(player1Mark, player2Mark)

game.start()