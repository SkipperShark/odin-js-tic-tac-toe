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


function createPlayer(name, mark) {
    let getMark =  () => mark
    let getName = () => name
    
    return {
        getMark,
        getName
    }
}

let board = (function() {
    const _noMarkValue = null
    const _height = 3
    const _width = 3
    const feBoard = document.getElementById("board")
    
    let _cells = []
    for(let i = 0; i < _height; i++) {
        let row = []
        for(let j = 0; j < _width; j++) {
            row.push(_noMarkValue)
        }
        _cells.push(row)
    }
    
    render();
    
    function setCellByCellNum(cellNum, mark) {
        _setCell({..._getXAndYFromCellNum(cellNum), mark})
    }
    
    // let printBoard = function() {
    //   log.debug("");
    //   _cells.forEach((row) => {
        //     console.log(row);
    //   })
    //   log.debug("");
    // }
    
    function getCells() { return _cells.map(arr => [...arr]) }
    function getHeight() { return _height }
    function getWidth() { return _width }
    function full() { return _cells.flat().filter(cell => cell === _noMarkValue).length === 0 }
    function render() {
        
    }
    
    function _getXAndYFromCellNum(cellNum) {
        let conv1BasedTo0Based = 0
        let x = Math.floor(cellNum / _width) - conv1BasedTo0Based
        let y = cellNum % _height - conv1BasedTo0Based
        return {x, y}
    }
    
    function _setCell({x, y, mark}) {
        if (_cells[x] === undefined || _cells[x][y] === undefined) {
            throw Error("You have chosen an invalid cell!")
        }
        if (_cells[x][y] !== null) {
            throw Error("Cell already has a mark!")
        }
        _cells[x][y] = mark
    }
    
    return {
        full,
        setCellByCellNum,
        getCells,
        getHeight,
        getWidth
    }
})()

// let consoleIOController = (function(rlInput, rlOutput) {
//   const rl = createInterface({
//     input: rlInput,
//     output: rlOutput,
//   });

//   let promptUser = (message, inputHandler) => {
    //     rl.question(chalk.blueBright(message), inputHandler)
//   }

//   let terminate = () => {
    //     rl.close()
//   }

//   return {
//     promptUser,
//     terminate
//   }
// })(rlInput, rlOutput)


let game = (function(player1Mark, player2Mark) {
    let player1 = createPlayer("Mark", player1Mark) 
    let player2 = createPlayer("John", player2Mark)
    let player1Turn = true
    // let board = createBoard()
    
    function start() {
        log.info("Welcome to Odin Tic-tac-toe!")
        playRound()
    }
    
    function playRound() {
        if (board.full() === true) {
            _endGame({isTie: true})
            return
        }
        let message = `${_curPlayer().name}'s turn, where would you `
        + `like to put your ${_curPlayer().mark} mark?\n`;
        // consoleIOController.promptUser(message, _inputHandler)
    }
    
    function _inputHandler(input) {
        try {
            board.setCellByCellNum(parseInt(input), _curPlayer().mark)
            if (_winnerFound() === true) {
                _endGame()
                return
            }
            player1Turn = !player1Turn
            playRound()
            return
        }
        catch (error) {
            log.error(error.message)
            playRound()
            return
        }
    }
    
    function _winnerFound() {
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
    
    function _curPlayer() {
        let player = player1Turn? player1 : player2
        return {
            mark: player.getMark(),
            name: player.getName()
        }
    }
    
    function _endGame({isTie=false} = {}) {
        if (isTie) {
            log.info(`Tie!, thanks for playing!`)
        } else {
            log.info(`Winner found! Congrats ${_curPlayer().name}!`)
        }
        consoleIOController.terminate()
    }
    
    return {
        start
    }
    
})(player1Mark, player2Mark)

game.start()