
var PLAYER_NONE = 0;
var PLAYER_BLACK = 1;
var PLAYER_WHITE = 2;

var GAME_STATE_CONTINUE = 0;
var GAME_STATE_OVER = 1;

function Board(rows, columns, initialValue) {
  'use strict';
  if(typeof initialValue === 'undefined') {
    initialValue = 0;
  }

  this.ROWS = rows;
  this.COLS = columns;
  this.INITIAL_VALUE = initialValue;

  this.state = new Array(rows);
  for (var i = 0; i < rows; i++) {
    this.state[i] = new Array(columns);
    for (var j = 0; j < columns; j++) {
      this.state[i][j] = initialValue;
    }
  }
}

Board.prototype.isValid = function(x, y) {
  'use strict';
  return x >= 0 && x < this.ROWS && y >= 0 && y < this.COLS;
};

Board.prototype.getCounts = function() {
  'use strict';
  var counts = {};
  var col;
  var item;

  for (var i = this.state.length - 1; i >= 0; i--) {
    col = this.state[i];
    for (var j = col.length - 1; j >= 0; j--) {
      item = col[j];
      if(item in counts){
        counts[item]++;
      } else{
        counts[item] = 1;
      }
    }
  }
  return counts;
};

function OthelloController(initialState) {
  'use strict';
  if(typeof initialState === 'undefined'){
    initialState = this.initialState;
  }
  this.board = new Board(8,8,PLAYER_NONE);
  this.applyState(initialState);
  this.counts = this.board.getCounts();
}

OthelloController.prototype.applyState = function(boardState) {
  'use strict';
  if(typeof boardState === 'undefined'){
    boardState = {};
  }
  if(typeof boardState.moves === 'undefined'){
    boardState.moves = [];
  }
  for(var i = 0; i < 8; i++){
    for(var j = 0; j < 8; j++){
      this.board.state[i][j] = PLAYER_NONE;
    }
  }
  for (var k = 0; k < boardState.moves.length; k++) {
    var move = boardState.moves[k];
    this.board.state[move.x][move.y] = move.player;
  }
  this.turnNumber = (typeof boardState.turnNumber !== 'undefined' ?
    boardState.turnNumber : 1);
  this.turnPlayer = (typeof boardState.turnPlayer !== 'undefined' ?
    boardState.turnPlayer : PLAYER_BLACK);
  this.passCount = (typeof boardState.passCount !== 'undefined' ?
    boardState.passCount : 0);
  this.gameState = (typeof boardState.gameState !== 'undefined' ?
    boardState.gameState : GAME_STATE_CONTINUE);
};

OthelloController.prototype.initialState = {
  moves: [
    {x: 3, y: 3, player: PLAYER_BLACK},
    {x: 3, y: 4, player: PLAYER_WHITE},
    {x: 4, y: 3, player: PLAYER_WHITE},
    {x: 4, y: 4, player: PLAYER_BLACK}
  ],
  turnNumber: 1,
  turnPlayer: PLAYER_BLACK,
  passCount: 0,
  gameState: GAME_STATE_CONTINUE
};

OthelloController.prototype.turnNumber = 1;
OthelloController.prototype.turnPlayer = PLAYER_BLACK;
OthelloController.prototype.gameState = GAME_STATE_CONTINUE;
OthelloController.prototype.counts = {};
OthelloController.prototype.passCount = 0;

OthelloController.prototype.startTurn = function() {
  if(this.gameState === GAME_STATE_OVER){
    return {
      turnNumber: this.turnNumber,
      turnPlayer: this.turnPlayer,
      counts: this.counts,
      gameState: this.gameState
    };
  }
  var canPlay = false;
  for(var i = 0; i < 8; i++){
    for(var j = 0; j < 8; j++){
      if(this.tryToPlacePiece(i,j)){
        canPlay = true;
        break;
      }
    }
  }
  if(canPlay){
    this.passCount = 0;
    return {
      turnNumber: this.turnNumber,
      turnPlayer: this.turnPlayer,
      counts: this.counts,
      gameState: this.gameState
    };
  } else{
    this.passCount++;
    if(this.passCount === 2){
      this.gameState = GAME_STATE_OVER;
      this.counts = this.board.getCounts();
      return {
        turnNumber: this.turnNumber,
        turnPlayer: this.turnPlayer,
        counts: this.counts,
        gameState: this.gameState
      };
    } else{
      this.endTurn();
      return this.startTurn();
    }
  }
};

OthelloController.prototype.endTurn = function() {
  if(this.gameState === GAME_STATE_OVER){
    return;
  }
  this.turnNumber++;
  this.turnPlayer = (this.turnPlayer % 2) + 1;
  this.counts = this.board.getCounts();
  if(typeof this.counts[PLAYER_NONE] === 'undefined'){
    this.gameState = GAME_STATE_OVER;
  }
};

OthelloController.prototype.placePiece = function(x, y) {
  'use strict';
  if (this.board.isValid(x,y) && this.board.state[x][y] !== PLAYER_NONE) {
    return false;
  } else {
    this.board.state[x][y] = this.turnPlayer;
    if(this.removePieces(x,y,this.turnPlayer)) {
      this.endTurn();
      return true;
    } else {
      this.board.state[x][y] = PLAYER_NONE;
      return false;
    }
  }
};

OthelloController.prototype.tryToPlacePiece = function(x, y) {
  'use strict';
  if (this.board.isValid(x,y) && this.board.state[x][y] !== PLAYER_NONE) {
    return false;
  } else {
    this.board.state[x][y] = this.turnPlayer;
    if(this.removePieces(x,y,this.turnPlayer, true)) {
      this.board.state[x][y] = PLAYER_NONE;
      return true;
    } else {
      this.board.state[x][y] = PLAYER_NONE;
      return false;
    }
  }
};

OthelloController.prototype.removePieces = function(x, y, player, dryRun) {
  'use strict';
  if(typeof dryRun === 'undefined'){
    dryRun = false;
  }
  var didFlip = false;
  var opColor = (player % 2) + 1;

  var removeAlongRule = function(getCoords, board){
    var coords;
    for(var i = 1;; i++){
      coords = getCoords(x,y,i);
      if(!(board.isValid(coords.x, coords.y) &&
        board.state[coords.x][coords.y] !== PLAYER_NONE)){
        break;
      }
      if(board.state[coords.x][coords.y] !== opColor){
        i--;
        coords = getCoords(x,y,i);
        while(board.state[coords.x][coords.y] === opColor) {
          if(!dryRun){
            board.state[coords.x][coords.y] = player;
          }
          didFlip = true;
          i--;
          coords = getCoords(x,y,i);
        }
        break;
      }
    }
  };

  removeAlongRule(function(x,y,i) {return {x:x+i, y:y};}, this.board);
  removeAlongRule(function(x,y,i) {return {x:x-i, y:y};}, this.board);
  removeAlongRule(function(x,y,i) {return {x:x, y:y+i};}, this.board);
  removeAlongRule(function(x,y,i) {return {x:x, y:y-i};}, this.board);
  removeAlongRule(function(x,y,i) {return {x:x+i, y:y+i};}, this.board);
  removeAlongRule(function(x,y,i) {return {x:x-i, y:y-i};}, this.board);
  removeAlongRule(function(x,y,i) {return {x:x+i, y:y-i};}, this.board);
  removeAlongRule(function(x,y,i) {return {x:x-i, y:y+i};}, this.board);

  return didFlip;
};
