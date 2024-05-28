/** more capabilities in the documentation:
 * https://github.com/dmotz/trystero
 * https://oxism.com/trystero
 */

import { joinRoom } from "https://cdn.skypack.dev/pin/trystero@v0.18.0-r4w3880OHw2o0euVPNYJ/mode=imports,min/optimized/trystero/nostr.js";

// .../?room=someNumberOrId
const roomId = "room" + new URLSearchParams(window.location.search).get("room");
const room = joinRoom({ appId: "hchiam-trystero-demo" }, roomId, "silly_pwd");

const pre = document.querySelector("pre");

console.log("started");

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

const localData = { count: 1 };
const [sendData, getData] = room.makeAction("data");

// // tell other peers currently in the room
// sendData({ count: 1 });

// tell newcomers
room.onPeerJoin((peerId) => {
  sendData(localData.count, peerId);
  // localData.count = 1
  console.log(localData);
  log(JSON.stringify(localData));
});

// listen for peers sending data
getData((data, peerId) => {
  localData.count = data;
  console.log(localData);
  log(JSON.stringify(localData));
});

// listen for peers leaving
room.onPeerLeave((peerId) => {
  localData.count = 1;
  console.log(localData);
  log(JSON.stringify(localData));
});

document.querySelector("#update").addEventListener("click", () => {
  localData.count++;
  sendData(localData.count);
  console.log(localData);
  log(JSON.stringify(localData));
});
