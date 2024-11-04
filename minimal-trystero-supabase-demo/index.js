/** more capabilities in the documentation:
 * https://github.com/dmotz/trystero
 * https://oxism.com/trystero
 */

// import { joinRoom } from "https://cdn.skypack.dev/pin/trystero@v0.18.0-r4w3880OHw2o0euVPNYJ/mode=imports,min/optimized/trystero/nostr.js";
import { joinRoom } from "./trystero-supabase.0.20.0.min";

// TODO: follow https://github.com/dmotz/trystero?tab=readme-ov-file#supabase-setup
const yourSubdomain = "...";
const yourSupabaseKey = "...";
const room = joinRoom(
  {
    appId: "https://" + yourSubdomain + ".supabase.co",
    supabaseKey: yourSupabaseKey,
  },
  "room42"
);

const pre = document.querySelector("pre");

room.onPeerJoin((userId) => {
  console.log("userId", userId);
  pre.textContent += `userId: ${userId}\n`;
});
room.onPeerLeave((userId) => {
  console.log("userId", userId);
  pre.textContent += `userId: ${userId}\n`;
});
