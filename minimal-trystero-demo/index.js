/** more capabilities in the documentation:
 * https://github.com/dmotz/trystero
 * https://oxism.com/trystero
 */

import { joinRoom } from "https://cdn.skypack.dev/pin/trystero@v0.18.0-r4w3880OHw2o0euVPNYJ/mode=imports,min/optimized/trystero/nostr.js";

const room = joinRoom({ appId: "hchiam-minimal-trystero-demo" }, "room42");

const pre = document.querySelector("pre");

room.onPeerJoin((userId) => {
  console.log("userId", userId);
  pre.textContent += `userId: ${userId}\n`;
});
room.onPeerLeave((userId) => {
  console.log("userId", userId);
  pre.textContent += `userId: ${userId}\n`;
});
