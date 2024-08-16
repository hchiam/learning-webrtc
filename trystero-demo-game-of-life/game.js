/**
 * updateCallback(localData):
 * (data) => {
 *   localData = data;
 *   sendData(localData);
 * }
 */
export function runGame(localData, updateCallback) {
  initBoard(localData);
  updateCallback(localData);
}

export function play(localData, updateCallback) {
  console.log("localData", localData);
  localData._board[0][0] = "o";
  console.log("localData", localData);
  updateCallback(localData);
}

function initBoard(localData) {
  localData._board = get2dArray(10, 10, "x");
}

function get2dArray(rows, cols, val = "") {
  return new Array(rows).fill(null).map(() =>
    new Array(cols).fill(null).map(() => {
      return val;
    })
  );
}
