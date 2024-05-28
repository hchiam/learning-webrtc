# Learning WebRTC

Just one of the things I'm learning. https://github.com/hchiam/learning

https://codelabs.developers.google.com/codelabs/webrtc-web/#0

https://www.youtube.com/watch?v=DvlyzDZDEq4

https://github.com/WebDevSimplified/Zoom-Clone-With-WebRTC

https://github.com/peers/peerjs

https://peerjs.com

PeerJS's server creates user IDs for you.

```html
<script src="https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js"></script>
```

## webrtc-wds-demo

To run this demo locally, you need to run commands in two separate terminals:

1. Run `server.js`:

```sh
yarn dev
```

and

2. Run a local peer server:

```sh
# yarn global add peer
peerjs --port 3001 # peer server on http://localhost:3001
# to close this process, close both tabs and then hit control+c
```

_**NOTE:**_ you might not get videos to stream, but at least the blocks for video streams will appear/disappear as expected.
