const socket = io("/");
// use a local peerjs server for this demo
const myPeer = new Peer(undefined, {
  host: "/",
  port: 3001,
});

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

// // for testing:
// socket.on("user-connected", (userId) => {
//   console.log("User connected", userId);
// });

const videoGrid = document.querySelector("#video-grid");
const myVideo = document.createElement("video");
const peers = {}; // so we can store peers[userId] = call;
myVideo.muted = true;
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    addVideoStream(videoGrid, myVideo, stream);

    console.log("before call");
    myPeer.on("call", (call) => {
      console.log("IN call");
      // answer their call and send them our stream:
      call.answer(stream);

      // get their stream too:
      const theirVideo = document.createElement("video");
      call.on("stream", (theirStream) => {
        console.log("IN stream");
        // handle their stream
        addVideoStream(videoGrid, theirVideo, theirStream);
      });
    });

    socket.emit("ready");

    socket.on("user-connected", (userId) => {
      console.log("user-connected userId:", userId);
      connectToNewUser(videoGrid, userId, stream);
    });
  });

socket.on("user-disconnected", (userId) => {
  console.log("user-disconnected userId:", userId);
  if (peers[userId]) peers[userId].close(); // because peers[userId] = call;
});

function addVideoStream(videoGrid, video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.appendChild(video);
}

function connectToNewUser(videoGrid, userId, stream) {
  const call = myPeer.call(userId, stream); // send them my userId and my stream
  const theirVideo = document.createElement("video");
  call.on("stream", (theirStream) => {
    // handle their stream
    addVideoStream(videoGrid, theirVideo, theirStream);
  });
  call.on("close", () => {
    theirVideo.remove();
  });
  peers[userId] = call;
}
