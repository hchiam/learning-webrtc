import firebaseConfig from "./firebase-db-config.json";

export class RoomConnector {
  constructor(roomId) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.roomId = roomId;
    this.roomRef = firebase.database().ref(`rooms/${roomId}`);
    this.peer = null;
    this.connection = null;
    this.onMessageCallback = null;
  }

  setupPeerConnection(peerId) {
    this.connection = this.peer.connect(peerId);

    this.connection.on("open", () => {
      console.log("Peer connection opened");
    });

    this.connection.on("data", (data) => {
      console.log("Received data:", data);
      if (this.onMessageCallback) {
        this.onMessageCallback(data);
      }
    });
  }

  async createRoom() {
    this.peer = new Peer();

    return new Promise((resolve) => {
      this.peer.on("open", (id) => {
        console.log("My peer ID:", id);

        // Save peer ID to Firebase
        this.roomRef.set({
          peerId: id,
          status: "waiting",
        });

        // Listen for incoming connections
        this.peer.on("connection", (conn) => {
          console.log("Incoming connection");
          this.connection = conn;

          conn.on("data", (data) => {
            console.log("Received data:", data);
            if (this.onMessageCallback) {
              this.onMessageCallback(data);
            }
          });
        });

        resolve(id);
      });
    });
  }

  async joinRoom() {
    const room = await this.roomRef.get();
    if (!room.exists()) {
      throw new Error("Room not found");
    }

    const { peerId } = room.val();
    if (!peerId) {
      throw new Error("Invalid room data");
    }

    this.peer = new Peer();

    return new Promise((resolve) => {
      this.peer.on("open", (myPeerId) => {
        console.log("My peer ID:", myPeerId);
        this.setupPeerConnection(peerId);
        resolve(myPeerId);
      });
    });
  }

  sendMessage(message) {
    if (this.connection && this.connection.open) {
      this.connection.send(message);
      return true;
    }
    return false;
  }

  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  disconnect() {
    if (this.connection) {
      this.connection.close();
    }
    if (this.peer) {
      this.peer.destroy();
    }
    this.roomRef.remove();
  }
}
