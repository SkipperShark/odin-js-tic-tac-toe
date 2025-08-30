function createPlayer(mark) {
  getMark = function() {
    return mark
  }

  return {
    getMark
  }
}


let player1 = createPlayer("X") 
let player2 = createPlayer("O")
console.log(player2.getMark())