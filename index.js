let player1Mark = "X"
let player2Mark = "O"


let displayController = (function() {
	const ulBoard = document.getElementById("board")
	const divResetButton = document.getElementById("resetButton")
	const pCurrentPlayer = document.getElementById("currentPlayer")
	
	function renderBoard(cells, cellClickHandler) {
		ulBoard.innerHTML = ""
		cells.flat().forEach( (cell, i) => {
			const newLi = document.createElement("li")
			newLi.className = "cellContainer"
			const newButton = document.createElement("button")
			newButton.textContent = cell
			newButton.className = "cell"
			newButton.addEventListener("click", () => cellClickHandler(i))
			newLi.setAttribute("cellId", i)
			newLi.appendChild(newButton)
			ulBoard.appendChild(newLi)
		})
	}
	
	function renderCurrentPlayer(playerName, playerMark) {
		pCurrentPlayer.innerHTML = ""
		pCurrentPlayer.innerText = `${playerName}'s Turn! Place your`
		const span = document.createElement("span")
		span.className = "currentMark"
		span.innerText = playerMark
		pCurrentPlayer.appendChild(span)

	}

	function renderResetButton(onClickHandler) {
		divResetButton.innerHTML = ""
		const btn = document.createElement("button")
		btn.className = "btn"
		btn.innerText = "Reset"
		btn.addEventListener("click", onClickHandler)
		divResetButton.appendChild(btn)
	}
	
	return {
		renderBoard,
		renderResetButton,
		renderCurrentPlayer
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
	
	function _init () {
		_cells = []
		for(let i = 0; i < _height; i++) {
			let row = []
			for(let j = 0; j < _width; j++) {
				row.push(_noMarkValue)
			}
			_cells.push(row)
		}
	}
	
	function setCellByCellNum(cellNum, mark) {
		_setCell({..._getXAndYFromCellNum(cellNum), mark})
	}
	
	function getCells() { return _cells.map(arr => [...arr]) }
	function getHeight() { return _height }
	function getWidth() { return _width }
	function full() { return _cells.flat().every(cell => cell !== _noMarkValue)}
	
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

	let reset = () => _init()

	_init()
	
	return {
		reset,
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
	let winner = {
		"name" : null,
		"isTie" : false
	}
	
	function _resetGame() {
		player1Turn = true
		winner = {
			"name" : null,
			"isTie" : false
		}
		gameBoard.reset()
		_renderDisplay()
	}
	
	function start() {
		_resetGame()
	}
	
	function _renderDisplay() {
		displayController.renderBoard(gameBoard.getCells(), _inputHandler)
		displayController.renderCurrentPlayer(_curPlayerName(), _curMark())
		displayController.renderResetButton(_resetGame)
	}
	
	function _inputHandler(input) {
		if (_gameEnded()) {
			alert("Game ended!")
			return
		}
		try {
			gameBoard.setCellByCellNum(parseInt(input), _curMark())
			_checkWinner()
			if (_gameEnded()) {
				_handleGameEnd()
				return
			}
			player1Turn = !player1Turn
			_renderDisplay()
		}
		catch (error) {
			alert(error.message)
		}
	}

	
	function _checkWinner() {
		let cells = gameBoard.getCells()
		let bWidth = gameBoard.getWidth()
		let bHeight = gameBoard.getHeight()
		
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
			winner.name = _curPlayerName()
			return
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
		if (computeWinnerAlgo(groupsVertical) === true) {
			winner.name = _curPlayerName()
			return
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
		
		if (computeWinnerAlgo(groupsDiag) === true) {
			winner.name = _curPlayerName()
			return
		}
		
		if (gameBoard.full() === true) {
			winner.isTie = true
			return
		}
	}
	
	function _curPlayerName() {
		return player1Turn? player1.getName() : player2.getName()
	}
	
	function _curMark () {
		return player1Turn? player1.getMark() : player2.getMark()
	} 
	
	function _handleGameEnd() {
		_renderDisplay()
		if (winner.isTie === true) {
			alert(`Tie!, thanks for playing!`)
			return
		}
		alert(`Winner found! Congrats ${winner.name}!`)
	}
	
	function _gameEnded() {
		return winner.name != null || winner.isTie === true
	}
	
	return {
		start
	}
	
})(player1Mark, player2Mark)

game.start()