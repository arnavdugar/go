
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
  return x >= 0 && x < this.ROWS && y >= 0 && y < this.COLS;
};

Board.prototype.getCounts = function() {
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

function OthelloController() {
  'use strict';
  this.board = new Board(8,8,PLAYER_NONE);
  this.board.state[3][3] = PLAYER_BLACK;
  this.board.state[3][4] = PLAYER_WHITE;
  this.board.state[4][3] = PLAYER_WHITE;
  this.board.state[4][4] = PLAYER_BLACK;
  this.counts = this.board.getCounts();
}

OthelloController.prototype.turnNumber = 1;
OthelloController.prototype.turnPlayer = PLAYER_BLACK;
OthelloController.prototype.gameState = GAME_STATE_CONTINUE;
OthelloController.prototype.counts = {};

OthelloController.prototype.placePiece = function(x, y) {
  if (this.board.isValid(x,y) && this.board.state[x][y] !== PLAYER_NONE) {
    return false;
  } else {
    this.board.state[x][y] = this.turnPlayer;
    if(this.removePieces(x,y,this.turnPlayer)) {
      this.turnNumber++;
      this.turnPlayer = (this.turnPlayer % 2) + 1;
      this.counts = this.board.getCounts();
      if(typeof this.counts[PLAYER_NONE] === 'undefined'){
        this.gameState = GAME_STATE_OVER;
      }
      return true;
    } else {
      this.board.state[x][y] = PLAYER_NONE;
      return false;
    }
  }
};

OthelloController.prototype.removePieces = function(x, y, player) {
  'use strict';
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
          board.state[coords.x][coords.y] = player;
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