/*
gogame.js
class GoGame represents game logic.

Game Flow
-----------
Start game: gg = new GoGame()
Draw Board: myDrawFunction(gg.getBoardState())
Start Turn: player = gg.startTurn().turnPlayer
Take the turn: either passTurn() or placePiece(x,y)
  - These return true on success or false on failure.
  - Try different moves if one fails
  - Calling startTurn() again will give you the same turn number and player
End the turn: gameState = gg.endTurn().gameState
  - If it's GAME_STATE_OVER, someone has won
  - If it's GAME_STATE_CONTINUE, call startTurn() to start the next turn
If continue: redraw board
*/

var ROWS = 19;
var COLS = 19;

var PLAYER_NONE = 0;
var PLAYER_BLACK = 1;
var PLAYER_WHITE = 2;

var GAME_STATE_CONTINUE = 0;
var GAME_STATE_OVER = 1;

function GoGame() {
  'use strict';
  this.boardState = new Array(ROWS);
  for (var i = this.boardState.length - 1; i >= 0; i--) {
    this.boardState[i] = new Array(COLS);
    for (var j = this.boardState[i].length - 1; j >= 0; j--) {
      this.boardState[i][j] = 0;
    }
  }
}

GoGame.prototype.boardState = new Array(ROWS);

GoGame.prototype.turnNumber = 1;

GoGame.prototype.turnPlayer = PLAYER_BLACK;

GoGame.prototype.passCount = 0;

GoGame.prototype.turnTaken = false;

GoGame.prototype.getBoardState = function() {
  'use strict';
  return this.gameState;
};

GoGame.prototype.placePiece = function(x, y) {
  'use strict';
  if(!this.turnTaken && this.boardState[x][y] === PLAYER_NONE){
    this.boardState[x][y] = player;
    this.passCount = 0;
    thus.turnTaken = true;
    return true;
  } else{
    return false;
  }
};

GoGame.prototype.passTurn = function() {
  'use strict';
  if(!this.turnTaken){
    this.passCount += 1;
    this.turnTaken = true;
    return true;
  } else{
    return false;
  }
};

GoGame.prototype.startTurn = function() {
  'use strict';
  return {
    turnNumber: this.turnNumber,
    turnPlayer: this.turnPlayer
  };
};

GoGame.prototype.endTurn = function() {
  'use strict';
  return {
    gameState: this.gameState
  };
};
