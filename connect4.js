/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  // set boardRow to empty array
  // while board is not complete, create 7x null items in the boardRow array, then push it onto board.
  // Will run 6x times to give board 6 elements - each element is a 7 element array.
  while (board.length < HEIGHT) {
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board');
  // TODO: add comment for this code
  // Create the top TableRow for the board, set it's id to 'colum-top', and add a click lisenter for submitting a move.
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //Create 7 TableCells, each with ID of x (0 - 6) to match the board Array, then appened to the top TableRow
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  //Appened the top TableRow filled with cells to the htmlBoard table
  htmlBoard.append(top);

  // TODO: add comment for this code
  //Create the rest of the rows for the gameboard

  // Create a new TableRow and fill it with 7x TableCells appropriately id'd and appended.
  // runs 6x 
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");

    // create 7 TableCells, each with id set to an Y-X combo for easy ID in code logic later
    // 0-0 is top-left cell. 5-6 is bottom-right
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }

    // Append the built-out row to the htmlBoard
    htmlBoard.append(row);
  }
  // htmlBoard has had 6x TableRows appended to it, each with 7x TableCells id'd approripately with Y-X coordinates.
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let i = board.length - 1; i >= 0; i--) {
    if (!(board.at(i).at(x))) {
      console.log(`lowest cell is ${i}-${x}`);
      return i;
    }
  }
  return null;
}

//Custom Function to switch Player
function switchPlayer() {
  currPlayer = currPlayer < 2 ? 2 : 1;
}

//Custom Function to check if entire board is filled
function isBoardFull() {
  let filled = board.every((row) => {
    return row.every((cell) => cell === 1 || cell === 2 ? true : false);
  });
  console.log(filled);
  if (filled) endGame('Game ends in a Tie!');
}

//Custom Function to place piece in board array
// fill correct cell with currPlayer value
function placeInBoard(y, x) {
  console.log(`cell ${y}-${x} is ${board[y][x]}`);
  board[y][x] = currPlayer;
  console.log(`cell ${y}-${x} is now ${board[y][x]}`);
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell\
  // create Div element + assign class piece p(1/2)
  let piece = document.createElement('div');
  piece.setAttribute("class", `piece p${currPlayer}`);
  let place = document.getElementById(`${y}-${x}`);
  place.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  console.log(findSpotForCol(x));
  console.log(`y = ${y}`);
  if (y === null) {
    return;
  }


  if (y !== null) {
    // place piece in board and add to HTML table
    placeInTable(y, x);
    placeInBoard(y, x);
  }
  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // TODO: check if all cells in board are filled; if so call, call endGame
  isBoardFull();
  //switchPlayer
  switchPlayer();
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // for every row
  for (let y = 0; y < HEIGHT; y++) {
    // for every cell in that row
    for (let x = 0; x < WIDTH; x++) {
      // set 4 win conditions
      // horiz checks from current y-x cell -> 4 cells to the right
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      // vert checks from current y-x cell -> 4 cells above
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // diagDR checks from current y-x cell -> 4 cells above + 4 cells to the right
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      // diagDL checks from current y-x cell -> 4 cells below + 4 cells to the left
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      // if any of these win conditions is met by the current player, we return the call for checkForWin() to be true.
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
