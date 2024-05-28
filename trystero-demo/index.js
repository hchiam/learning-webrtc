/** more capabilities in the documentation:
 * https://github.com/dmotz/trystero
 * https://oxism.com/trystero
 */

import { joinRoom } from "https://cdn.skypack.dev/pin/trystero@v0.18.0-r4w3880OHw2o0euVPNYJ/mode=imports,min/optimized/trystero/nostr.js";

// .../?room=someNumberOrId
const roomId = "room" + new URLSearchParams(window.location.search).get("room");
const room = joinRoom({ appId: "trystero-demo1" }, roomId);

const pre = document.querySelector("pre");

room.onPeerJoin((userId) => {
  console.log("userId", userId);
  pre.textContent += `userId: ${userId}\n`;
});
room.onPeerLeave((userId) => {
  console.log("userId", userId);
  pre.textContent += `userId: ${userId}\n`;
});
