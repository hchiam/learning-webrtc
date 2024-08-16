export class GameController {
  constructor(sendData) {
    this.sendData = sendData;
  }

  startGame(localData) {
    this.initBoard(localData);
    this.sendData(localData);
  }

  initBoard(localData) {
    localData._board = get2dArray(10, 10, "x");
  }

  play(localData) {
    localData._board[0][0] = "o";
    this.sendData(localData);
  }

  updatePosition(localData, peerId, xDelta = 0, yDelta = 0) {
    const { x, y } = localData[peerId];
    localData[peerId].x = x === undefined ? xDelta : Number(x) + Number(xDelta);
    localData[peerId].y = y === undefined ? yDelta : Number(y) + Number(yDelta);
    this.sendData(localData);
  }
}

function get2dArray(rows, cols, val = "") {
  return new Array(rows).fill(null).map(() =>
    new Array(cols).fill(null).map(() => {
      return val;
    })
  );
}
