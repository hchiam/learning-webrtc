# Learning WebRTC

Just one of the things I'm learning. https://github.com/hchiam/learning

Use a browser API that enables P2P (peer-to-peer) communication. PeerJS can simplify some of working with it for you.

https://codelabs.developers.google.com/codelabs/webrtc-web/#0

https://www.youtube.com/watch?v=DvlyzDZDEq4

https://github.com/WebDevSimplified/Zoom-Clone-With-WebRTC

https://github.com/peers/peerjs

https://peerjs.com

https://www.youtube.com/watch?v=WmR9IMUD_CY

https://github.com/fireship-io/webrtc-firebase-demo/blob/main/main.js

PeerJS's server creates user IDs for you.

```html
<script src="https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js"></script>
```

## netplay.js demos

Uses https://github.com/rameshvarun/netplayjs

- https://hchiam-webrtc-netplayjs-demo-minimal.surge.sh/

- https://hchiam-netplay-demo.surge.sh/

- see the netplay-demo-... folders for more examples/experiments

## webrtc-wds-demo

To run this demo locally, you need to run commands in two separate terminals:

1. Run `server.js`:

```sh
npm run dev
```

and

2. Run a local peer server:

```sh
# npm install -g peer
peerjs --port 3001 # peer server on http://localhost:3001
# to close this process, close both tabs and then hit control+c
```

_**NOTE:**_ you might not get videos to stream, but at least the blocks for video streams will appear/disappear as expected.

## trystero-demo

[learning-webrtc/minimal-trystero-demo](https://github.com/hchiam/learning-webrtc/tree/main/minimal-trystero-demo) --> `yarn dev` to `npm run vite`

- https://hchiam-minimal-trystero-demo.surge.sh/

[learning-webrtc/minimal-2-trystero-demo](https://github.com/hchiam/learning-webrtc/tree/main/minimal-2-trystero-demo) --> `yarn dev` to `npm run vite`

- https://hchiam-minimal-2-trystero-demo.surge.sh/

[learning-webrtc/trystero-demo](https://github.com/hchiam/learning-webrtc/tree/main/trystero-demo) --> `yarn dev` to `npm run vite`

- https://hchiam-trystero-demo.surge.sh/

https://github.com/dmotz/trystero

https://oxism.com/trystero/
