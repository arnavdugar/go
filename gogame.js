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

var MOVE_STATUS_VALID = 'MOVE_STATUS_VALID';
var MOVE_STATUS_SUICIDE = 'MOVE_STATUS_SUICIDE';
var MOVE_STATUS_CAPTURES = 'MOVE_STATUS_CAPTURES';

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

GoGame.prototype.gameState = GAME_STATE_CONTINUE;

GoGame.prototype.boardState = new Array(ROWS);

GoGame.prototype.turnNumber = 1;

GoGame.prototype.turnPlayer = PLAYER_BLACK;

GoGame.prototype.passCount = 0;

GoGame.prototype.turnTaken = false;

GoGame.prototype.getBoardState = function() {
  'use strict';
  return this.boardState;
};

GoGame.prototype.placePiece = function(x, y) {
  'use strict';
  if(this.turnTaken){
    return false;
  } else if (x < 0 || x >= ROWS || y < 0 || y >= COLS){
    return false;
  } else if(this.boardState[x][y] !== PLAYER_NONE){
    return false;
  } else{
    this.boardState[x][y] = player;
    var moveResult = this.getRemovals(x,y,this.turnPlayer);
    if(moveResult.status === MOVE_STATUS_SUICIDE){
      this.boardState[x][y] = PLAYER_NONE;
      return false;
    } else if(moveResult.status === MOVE_STATUS_CAPTURES){

    }
    this.passCount = 0;
    thus.turnTaken = true;
    return true;
  }
};

GoGame.prototype.getPieceAtPosition = function(x, y) {
  'use strict';
  if (x < 0 || x >= ROWS || y < 0 || y >= COLS){
    return -1;
  } else{
    return this.boardState[x][y];
  }
};

GoGame.prototype.getNeighbors = function(x,y) {
  'use strict';
  return {
    up: this.getPieceAtPosition(x-1, y),
    down: this.getPieceAtPosition(x+1, y),
    left: this.getPieceAtPosition(x, y-1),
    right: this.getPieceAtPosition(x, y+1)
  };
};

GoGame.prototype.hasAdjacentLiberty = function(x,y) {
  'use strict';
  var neighbors = this.getNeighbors(x,y);
  return neighbors.up === PLAYER_NONE ||
         neighbors.down === PLAYER_NONE ||
         neighbors.left === PLAYER_NONE ||
         neighbors.right === PLAYER_NONE;
};

GoGame.prototype.hasConnectedLiberty = function(x,y,grid) {
  'use strict';
  var color = this.getPieceAtPosition(x,y);
  if(color !== PLAYER_WHITE && color !== PLAYER_BLACK){
    return false;
  }
  if(typeof grid === 'undefined'){
    grid = new Array(ROWS);
    for (var i = grid.length - 1; i >= 0; i--) {
      grid[i] = new Array(COLS);
      for (var j = grid[i].length - 1; j >= 0; j--) {
        grid[i][j] = 0;
      }
    }
  }

  grid[x][y] = 1;
  if(this.hasAdjacentLiberty(x,y)){
    return true;
  }
  if(x - 1 >= 0 &&
    grid[x-1][y] === 0 &&
    this.getPieceAtPosition(x-1,y) === color &&
    this.hasConnectedLiberty(x-1,y,grid)){
    return true;
  } else if(x + 1 < ROWS &&
    grid[x+1][y] === 0 &&
    this.getPieceAtPosition(x+1,y) === color &&
    this.hasConnectedLiberty(x+1,y,grid)){
    return true;
  } else if(y - 1 >= 0 &&
    grid[x][y-1] === 0 &&
    this.getPieceAtPosition(x,y-1) === color &&
    this.hasConnectedLiberty(x,y-1,grid)){
    return true;
  }
   else if(y + 1 < COLS &&
    grid[x][y+1] === 0 &&
    this.getPieceAtPosition(x,y+1) === color &&
    this.hasConnectedLiberty(x,y+1,grid)){
    return true;
  } else{
    return false;
  }
};

GoGame.prototype.getRemovals = function(x, y, player) {
  'use strict';
  var grid = new Array(ROWS);
  for (var i = grid.length - 1; i >= 0; i--) {
    grid[i] = new Array(COLS);
    for (var j = grid[i].length - 1; j >= 0; j--) {
      grid[i][j] = 0;
    }
  }

  var opponent = (player === PLAYER_WHITE ? PLAYER_BLACK : PLAYER_WHITE);

  if(
      (this.getPieceAtPosition(x-1,y) === opponent &&
       !this.hasConnectedLiberty(x-1,y,grid)) ||
      (this.getPieceAtPosition(x+1,y) === opponent &&
       !this.hasConnectedLiberty(x+1,y,grid)) ||
      (this.getPieceAtPosition(x,y-1) === opponent &&
       !this.hasConnectedLiberty(x,y-1,grid)) ||
      (this.getPieceAtPosition(x,y+1) === opponent &&
       !this.hasConnectedLiberty(x,y+1,grid))
    ){
    return {
      status: MOVE_STATUS_CAPTURES,
      removals: grid
    };
  } else {
    if(this.hasConnectedLiberty(x,y,grid)){
      return {
        status: MOVE_STATUS_VALID,
        removals: grid
      };
    } else{
      return {
        status: MOVE_STATUS_SUICIDE,
        removals: grid
      };
    }
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
  if(!this.turnTaken){
    this.passTurn();
  }
  if(this.passCount >= 2){
    this.gameState = GAME_STATE_OVER;
  } else{
    this.turnNumber += 1;
    this.turnPlayer =
      (this.turnNumber === PLAYER_WHITE ? PLAYER_BLACK : PLAYER_WHITE);
    this.turnTaken = false;
  }
  return {
    gameState: this.gameState
  };
};
