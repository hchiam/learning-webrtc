/** more capabilities in the documentation:
 * https://github.com/dmotz/trystero
 * https://oxism.com/trystero
 */

import {
  joinRoom,
  selfId,
} from "https://cdn.skypack.dev/pin/trystero@v0.18.0-r4w3880OHw2o0euVPNYJ/mode=imports,min/optimized/trystero/nostr.js";

// .../?room=someNumberOrId
const roomId =
  "room" + (new URLSearchParams(window.location.search).get("room") || 42);
const room = joinRoom(
  { appId: "hchiam-minimal-2-trystero-demo" },
  roomId,
  "silly_pwd"
);

const pre = document.querySelector("pre");

console.log("started");
log(`my peerId: ${selfId}`);

function log(text) {
  pre.textContent = `${text}\n`;
}

room.onPeerJoin((userId) => {
  console.log("userId", userId);
  log(`userId JOIN: ${userId}`);
});
room.onPeerLeave((userId) => {
  console.log("userId", userId);
  log(`userId LEFT: ${userId}`);
});

const localData = { sharedCount: 1 };
let myCount = 1;
const [sendData, getData] = room.makeAction("data");

// // tell other peers currently in the room
// sendData(myCount);

// tell newcomers
room.onPeerJoin((peerId) => {
  sendData(myCount, peerId);
  console.log(localData);
  log(JSON.stringify(localData, null, 4));
});

// listen for peers sending data
getData((data, peerId) => {
  Object.entries(data).forEach((x) => {
    localData[x[0]] = x[1];
  });
  localData[peerId] = data.peerCount;
  localData.sharedCount = data.sharedCount;
  console.log(localData);
  log(JSON.stringify(localData, null, 4));
});

// listen for peers leaving
room.onPeerLeave((peerId) => {
  delete localData[peerId];
  console.log(localData);
  log(JSON.stringify(localData, null, 4));
});

document.querySelector("#update").addEventListener("click", () => {
  myCount++;
  localData[selfId] = myCount;
  localData.sharedCount++;
  const data = {
    ...localData,
    peerCount: myCount,
    sharedCount: localData.sharedCount,
  };
  Object.entries(data).forEach((x) => {
    localData[x[0]] = x[1];
  });
  sendData(data);
  console.log(localData);
  log(JSON.stringify(localData, null, 4));
});
