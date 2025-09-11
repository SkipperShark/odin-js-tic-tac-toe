let player1Mark = "X"
let player2Mark = "O"


let displayController = (function() {
	const ulBoard = document.getElementById("board")
	const spanCurrentMark = document.getElementById("currentMark")

	function renderBoard(cells, cellClickHandler) {
		ulBoard.innerHTML = ""
		cells.flat().forEach( (cell, i) => {
			const newLi = document.createElement("li")
			newLi.className = "cell"
			const newButton = document.createElement("button")
			newButton.textContent = `${cell} - ${i}`
			newButton.addEventListener("click", () => cellClickHandler(i))
			newLi.setAttribute("cellId", i)
			newLi.appendChild(newButton)
			ulBoard.appendChild(newLi)
		})
	}

	function renderCurrentMarkDisplay(newMark) {
		spanCurrentMark.innerText = ""
		spanCurrentMark.innerText = newMark
	}

	return {
		renderBoard,
		renderCurrentMarkDisplay
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

let gameBoard = (function() {
	const _noMarkValue = null
	const _height = 3
	const _width = 3
	
	let _cells = []
	for(let i = 0; i < _height; i++) {
		let row = []
		for(let j = 0; j < _width; j++) {
			row.push(_noMarkValue)
		}
		_cells.push(row)
	}
	
	function setCellByCellNum(cellNum, mark) {
		_setCell({..._getXAndYFromCellNum(cellNum), mark})
	}
	
	// let printBoard = function() {
	// 	console.log("");
	// 	_cells.forEach((row) => {
	// 		console.log(row);
	// 	})
	// 	console.log("");
	// }
	
	function getCells() { return _cells.map(arr => [...arr]) }
	function getHeight() { return _height }
	function getWidth() { return _width }
	function full() { return _cells.flat().filter(cell => cell === _noMarkValue).length === 0 }
	
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


let game = (function(player1Mark, player2Mark) {
	let player1 = createPlayer("Mark", player1Mark) 
	let player2 = createPlayer("John", player2Mark)
	let player1Turn = true
	_render()
	
	function start() {
		playRound()
	}
	
	function playRound() {
		if (gameBoard.full() === true) {
			_endGame({isTie: true})
			return
		}
		// let message = `${_curPlayer().name}'s turn, where would you `
		// + `like to put your ${_curPlayer().mark} mark?\n`;
	}
	
	function _render() {
		displayController.renderBoard(gameBoard.getCells(), _inputHandler)
		let test = _getCurPlayer().mark
		console.log(test);
		displayController.renderCurrentMarkDisplay(_getCurPlayer().mark)
	}

	function _inputHandler(input) {
		try {
			gameBoard.setCellByCellNum(parseInt(input), _getCurPlayer().mark)
			if (_gameEndConditionMet() === true) {
				_endGame()
			}
			player1Turn = !player1Turn
			_render()
			// playRound()
			return
		}
		catch (error) {
			alert(error.message)
			playRound()
			return
		}
	}
	
	function _gameEndConditionMet() {
		let cells = gameBoard.getCells()
		let bWidth = gameBoard.getWidth()
		let bHeight = gameBoard.getHeight()
		console.log(cells)
		
		let computeWinnerAlgo = function(groups) {
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
		if (computeWinnerAlgo(cells) == true) {
			return true
		}
		
		// straight vertical lines
		let groupsVertical = []
		for(let col_i = 0; col_i < gameBoard.getWidth(); col_i++) {
			let col = []
			for (let row_i = 0; row_i < gameBoard.getHeight(); row_i++) {
				col.push(cells[row_i][col_i])
			}
			groupsVertical.push(col) 
		}
		if (computeWinnerAlgo(cells) === true) {
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
		
		if (computeWinnerAlgo(cells) === true) {
			return true
		}
		
		return false
	}
	
	function _getCurPlayer() {
		let player = player1Turn? player1 : player2
		return {
			mark: player.getMark(),
			name: player.getName()
		}
	}
	
	function _endGame({isTie=false} = {}) {
		if (isTie) {
			alert(`Tie!, thanks for playing!`)
			return
		}
		alert(`Winner found! Congrats ${_getCurPlayer().name}!`)
	}
	
	return {
		start
	}
	
})(player1Mark, player2Mark)

game.start()