/** more capabilities in the documentation:
 * https://github.com/dmotz/trystero
 * https://oxism.com/trystero
 */

import { joinRoom } from "https://cdn.skypack.dev/pin/trystero@v0.18.0-r4w3880OHw2o0euVPNYJ/mode=imports,min/optimized/trystero/nostr.js";

// .../?room=someNumberOrId
const roomId = "room" + new URLSearchParams(window.location.search).get("room");
const room = joinRoom({ appId: "hchiam-trystero-demo" }, roomId, "silly_pwd");

const pre = document.querySelector("pre");

function log(text) {
  pre.textContent += `${text}\n`;
}

// room.onPeerJoin((userId) => {
//   console.log("userId", userId);
//   log(`userId JOIN: ${userId}`);
// });
// room.onPeerLeave((userId) => {
//   console.log("userId", userId);
//   log(`userId LEFT: ${userId}`);
// });

const idsToNames = {};
const [sendName, getName] = room.makeAction("name");

// tell other peers currently in the room
sendName(location.href);

// tell newcomers
room.onPeerJoin((peerId) => {
  sendName(location.href, peerId);
});

// listen for peers sending data
getName((name, peerId) => {
  idsToNames[peerId] = name;
  log(`${name} JOINED`);
});

// listen for peers leaving
room.onPeerLeave((peerId) =>
  log(`${idsToNames[peerId] || "a weird stranger"} LEFT`)
);
