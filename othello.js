
var PLAYER_NONE = 0;
var PLAYER_BLACK = 1;
var PLAYER_WHITE = 2;

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

function OthelloController() {
  'use strict';
  this.board = new Board(8,8,PLAYER_NONE);
}

OthelloController.prototype.turnNumber = 1;
OthelloController.prototype.turnPlayer = PLAYER_BLACK;


