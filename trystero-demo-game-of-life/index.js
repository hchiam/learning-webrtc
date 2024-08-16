/** more capabilities in the documentation:
 * https://github.com/dmotz/trystero
 * https://oxism.com/trystero
 */

import {
  joinRoom,
  selfId,
} from "https://cdn.skypack.dev/pin/trystero@v0.18.0-r4w3880OHw2o0euVPNYJ/mode=imports,min/optimized/trystero/nostr.js";

import { runGame, play } from "./game";

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// .../?room=someNumberOrId
const roomId = "room" + new URLSearchParams(window.location.search).get("room");
const room = joinRoom(
  { appId: "hchiam-trystero-demo-game-of-life" },
  roomId,
  "silly_pwd"
);

const pre = $("pre");

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

let localData = {};
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
  console.log("onPeerJoin", peerId);
  printPlayers();
});

// listen for peers sending data
getData((data, peerId) => {
  // console.log("_______|\n\n", "getData localData", JSON.stringify(localData));
  // console.log("getData data", JSON.stringify(data));
  const before = JSON.stringify(localData);
  Object.entries(data).forEach((x) => {
    localData[x[0]] = x[1];
  });
  let needToSendData = false;
  if (!isNaN(localData[peerId]) && localData[peerId] === 0) {
    const max =
      Math.max(
        ...Object.values(localData).map((x) => (isNaN(x) ? 0 : Number(x)))
      ) + 1;
    localData[peerId] = Math.max(max, Object.keys(localData).length);
    needToSendData = true;
  }
  if (before !== JSON.stringify(localData)) {
    needToSendData = true;
  }
  if (needToSendData) sendData(localData);
  // console.log(
  //   `getData localData AFTER:\n${JSON.stringify(localData)}\n\n|_______`
  // );
  printPlayers();
});

// listen for peers leaving
room.onPeerLeave((peerId) => {
  delete localData[peerId];
  console.log("onPeerLeave", peerId);
  printPlayers();
});

$("#update").addEventListener("click", () => {
  sendData(localData);
  // console.log("#update click", JSON.stringify(localData));
  printPlayers();
});

function printPlayers() {
  const playersData = Object.entries(localData).filter(
    (x) => !x[0].startsWith("_")
  );
  const players = playersData.map((x) => `${x[0]}: ${x[1]}`).join("\n");
  const boardData = localData._board ?? [[]];
  const board = boardData.map((row) => row.join(" ")).join("\n");
  log(board + "\nplayers:\n" + players);
}

function updateData(data) {
  localData = data;
  sendData(localData);
}

runGame(localData, updateData);

$("#play").addEventListener("click", () => {
  play(localData, updateData);
});
