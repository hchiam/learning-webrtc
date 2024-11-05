import firebaseConfig from "./firebase-db-config.json";

export class RoomConnector {
  constructor(roomId) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.roomId = roomId;
    this.roomRef = firebase.database().ref(`rooms/${roomId}`);
    this.isInitiator = false; // Track whether this peer created the room

    // WebRTC
    this.pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    this.dataChannel = null;
    this.onMessageCallback = null;

    // Log connection state changes
    this.pc.onconnectionstatechange = () => {
      console.log("Connection state:", this.pc.connectionState);
    };

    // Handle incoming data channel
    this.pc.ondatachannel = (event) => {
      console.log("Received data channel");
      this.dataChannel = event.channel;
      this.setupDataChannel();
    };

    // Handle ICE candidates
    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(
          "Generated ICE candidate",
          this.isInitiator ? "initiator" : "joiner"
        );
        // Store the candidate in Firebase
        this.roomRef.child("candidates").push({
          candidate: event.candidate.toJSON(),
          isInitiator: this.isInitiator,
        });
      }
    };

    // Log ICE connection state
    this.pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", this.pc.iceConnectionState);
    };
  }

  setupDataChannel() {
    console.log("Setting up data channel");

    this.dataChannel.onopen = () => {
      console.log("Data channel is now open");
    };

    this.dataChannel.onclose = () => {
      console.log("Data channel is now closed");
    };

    this.dataChannel.onerror = (error) => {
      console.error("Data channel error:", error);
    };

    this.dataChannel.onmessage = (event) => {
      console.log("Received message:", event.data);
      if (this.onMessageCallback) {
        this.onMessageCallback(event.data);
      }
    };
  }

  async createRoom() {
    console.log("Creating room and WebRTC offer");
    this.isInitiator = true;

    // Create data channel
    this.dataChannel = this.pc.createDataChannel("channel");
    this.setupDataChannel();

    // Create and set local description
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    console.log("Created and set local description");

    // Save offer to Firebase
    await this.roomRef.set({
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
      status: "waiting",
    });
    console.log("Saved offer to Firebase");

    // Listen for ICE candidates from the other peer
    this.roomRef.child("candidates").on("child_added", (snapshot) => {
      const data = snapshot.val();
      if (data && !data.isInitiator) {
        console.log("Adding remote ICE candidate from joiner");
        this.pc
          .addIceCandidate(new RTCIceCandidate(data.candidate))
          .catch((e) => console.error("Error adding ICE candidate:", e));
      }
    });

    // Wait for answer
    return new Promise((resolve) => {
      this.roomRef.child("answer").on("value", async (snapshot) => {
        const answer = snapshot.val();
        if (answer) {
          console.log("Received answer from Firebase");
          await this.pc.setRemoteDescription(new RTCSessionDescription(answer));
          console.log("Set remote description from answer");
          resolve();
        }
      });
    });
  }

  async joinRoom() {
    console.log("Joining room");
    this.isInitiator = false;

    const room = await this.roomRef.get();
    if (!room.exists()) {
      throw new Error("Room not found");
    }

    const offer = room.val().offer;
    if (!offer) {
      throw new Error("Invalid room data");
    }

    // Listen for ICE candidates from the other peer
    this.roomRef.child("candidates").on("child_added", (snapshot) => {
      const data = snapshot.val();
      if (data && data.isInitiator) {
        console.log("Adding remote ICE candidate from initiator");
        this.pc
          .addIceCandidate(new RTCIceCandidate(data.candidate))
          .catch((e) => console.error("Error adding ICE candidate:", e));
      }
    });

    // Set remote description from offer
    console.log("Setting remote description from offer");
    await this.pc.setRemoteDescription(new RTCSessionDescription(offer));

    // Create and set local description
    console.log("Creating answer");
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);

    // Save answer to Firebase
    await this.roomRef.update({
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
      status: "ready",
    });
    console.log("Saved answer to Firebase");

    return true;
  }

  sendMessage(message) {
    console.log("Attempting to send message");
    console.log("DataChannel state:", this.dataChannel?.readyState);
    console.log("Connection state:", this.pc.connectionState);
    console.log("ICE Connection state:", this.pc.iceConnectionState);

    if (this.dataChannel?.readyState === "open") {
      this.dataChannel.send(message);
      return true;
    }
    return false;
  }

  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  disconnect() {
    console.log("Disconnecting...");
    if (this.dataChannel) {
      this.dataChannel.close();
    }
    if (this.pc) {
      this.pc.close();
    }
    this.roomRef.off();
    this.roomRef.remove();
  }
}
