let player1Mark = "X"
let player2Mark = "O"


let view = (function() {
	let doc = document
	const ulBoard = doc.getElementById("board")
	const pCurrentPlayer = doc.getElementById("currentPlayer")
	const btnChangePlayerName = doc.getElementById("changePlayerNameButton")
	const btnResetButton = doc.getElementById("resetButton")
	const dialog = doc.getElementById("changePlayerNameDialog")
	const form = doc.getElementById("changePlayerNameForm")
	const btnCloseChangePlayerName = doc.getElementById("cancelChangePlayerName")
	
	function renderBoard(cells, cellClickHandler) {
		ulBoard.innerHTML = ""
		cells.flat().forEach( (cell, i) => {
			const newLi = document.createElement("li")
			let bottomBorder = i <= 5 ? "cell-container-with-bottom-border" : "" 
			let rightBorder = (i + 1) % 3 > 0 ? "cell-container-with-right-border" : ""
			newLi.className = `cellContainer ${bottomBorder} ${rightBorder}`
			const newButton = document.createElement("button")
			newButton.textContent = cell
			newButton.className = "cell"
			newButton.addEventListener("click", () => cellClickHandler(i))
			newLi.setAttribute("cellId", i)
			newLi.appendChild(newButton)
			ulBoard.appendChild(newLi)
		})
	}
	
	function renderCurrentPlayerInfo(playerName, playerMark) {
		pCurrentPlayer.innerHTML = ""
		pCurrentPlayer.innerText = `${playerName}'s Turn! Place your`
		const span = document.createElement("span")
		span.className = "currentMark"
		span.innerText = playerMark
		pCurrentPlayer.appendChild(span)

	}

	let showMessage = (message) => pCurrentPlayer.innerHTML = message
	let openChangePlayerNameDialog = () => dialog.showModal()
	let closeChangePlayerNameDialog = () => dialog.close()
	
	return {
		renderBoard,
		renderCurrentPlayerInfo,
		showMessage,
		btnResetButton,
		btnChangePlayerName,
		btnCloseChangePlayerName,
		openChangePlayerNameDialog,
		closeChangePlayerNameDialog,
		form
	}
})()

function createPlayer(name, mark) {
	let playerName = name
	let playerMark = mark

	let getMark =  () => playerMark
	let getName = () => playerName
	let setName = (name) => playerName = name
	
	return {
		getMark,
		getName,
		setName
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
		init()
	}
	
	function _renderDisplay() {
		view.renderBoard(gameBoard.getCells(), _inputHandler)
		view.renderCurrentPlayerInfo(_curPlayerName(), _curMark())
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
	
	function _handleGameEnd() {
		_renderDisplay()
		if (winner.isTie === true) {
			alert(`Tie!, thanks for playing!`)
			return
		}
		alert(`Winner found! Congrats ${winner.name}!`)
	}
	
	let _curPlayerName = () => player1Turn? player1.getName() : player2.getName()
	let _curMark = () => player1Turn? player1.getMark() : player2.getMark()
	let _gameEnded = () => winner.name != null || winner.isTie === true

	let init = () => {
		view.btnResetButton.addEventListener("click", _resetGame)
		view.btnChangePlayerName.addEventListener(
			"click",
			() => view.openChangePlayerNameDialog()
		)
		view.btnCloseChangePlayerName.addEventListener(
			"click",
			() => {
				view.form.reset()
				view.closeChangePlayerNameDialog()
			}
		)
		view.form.addEventListener("submit", (e) => {
			const formData = new FormData(view.form)
			newPlayer1Name = formData.get("player1Name")
			if (!newPlayer1Name) {
				alert("Please enter a name for player 1!")
				return
			}
			newPlayer2Name = formData.get("player2Name")
			if (!newPlayer2Name) {
				alert("Please enter a name for player 2!")
				return
			}
			player1.setName(newPlayer1Name)
			player2.setName(newPlayer2Name)
			_renderDisplay()
			view.form.reset()
			view.closeChangePlayerNameDialog()
		})
	}
	
	return {
		start,
		init,
	}
	
})(player1Mark, player2Mark)

game.start()