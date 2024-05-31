/** more capabilities in the documentation:
 * https://github.com/dmotz/trystero
 * https://oxism.com/trystero
 */

import {
  joinRoom,
  selfId,
} from "https://cdn.skypack.dev/pin/trystero@v0.18.0-r4w3880OHw2o0euVPNYJ/mode=imports,min/optimized/trystero/nostr.js";

import { runGame } from "./game";

// .../?room=someNumberOrId
const roomId = "room" + new URLSearchParams(window.location.search).get("room");
const room = joinRoom(
  { appId: "hchiam-trystero-demo-game-of-life" },
  roomId,
  "silly_pwd"
);

const pre = document.querySelector("pre");

console.log("started");
log(`my peerId: ${selfId}`);

function log(text) {
  pre.textContent = `my selfId: ${selfId}\n\n${text}\n`;
}

room.onPeerJoin((userId) => {
  console.log("userId", userId);
  log(`userId JOIN: ${userId}`);
});
room.onPeerLeave((userId) => {
  console.log("userId", userId);
  log(`userId LEFT: ${userId}`);
});

const localData = {};
const [sendData, getData] = room.makeAction("data");

// tell other peers currently in the room
localData[selfId] = 0;
sendData(localData);

// tell newcomers
room.onPeerJoin((peerId) => {
  if (!isNaN(localData[peerId]) && localData[peerId] === 0) {
    const max =
      Math.max(
        ...Object.values(localData).map((x) => (isNaN(x) ? 0 : Number(x)))
      ) + 1;
    localData[peerId] = Math.max(max, Object.keys(localData).length);
    sendData(localData, peerId);
  }
  console.log("onPeerJoin", localData);
  printPlayers();
});

// listen for peers sending data
getData((data, peerId) => {
  console.log("getData 1", localData);
  console.log("getData 1.5", data);
  const before = JSON.stringify(localData);
  Object.entries(data).forEach((x) => {
    localData[x[0]] = x[1];
  });
  if (!isNaN(localData[peerId]) && localData[peerId] === 0) {
    const max =
      Math.max(
        ...Object.values(localData).map((x) => (isNaN(x) ? 0 : Number(x)))
      ) + 1;
    localData[peerId] = Math.max(max, Object.keys(localData).length);
    sendData(localData);
  }
  if (before !== JSON.stringify(localData)) {
    sendData(localData);
  }
  console.log("getData 2", localData);
  printPlayers();
});

// listen for peers leaving
room.onPeerLeave((peerId) => {
  delete localData[peerId];
  console.log("onPeerLeave", localData);
  printPlayers();
});

document.querySelector("#update").addEventListener("click", () => {
  sendData(localData);
  console.log("#update click", localData);
  printPlayers();
});

function printPlayers() {
  const playersData = Object.entries(localData).filter(
    (x) => !x[0].startsWith("_")
  );
  const players = playersData.map((x) => `${x[0]}: ${x[1]}`).join("\n");
  const boardData = localData._board ?? [[]];
  const board = boardData.map((row) => row.join(" ")).join("\n");
  log(board + "\n" + players);
}

runGame(localData, (data) => {
  localData = data;
  sendData(localData);
});
