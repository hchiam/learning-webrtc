/**
 * updateCallback(localData):
 * (data) => {
 *   localData = data;
 *   sendData(localData);
 * }
 */
export function runGame(localData, updateCallback) {
  console.log("init runGame 1", localData);
  initBoard(localData);
  updateCallback(localData);
  console.log("init runGame 2", localData);
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
