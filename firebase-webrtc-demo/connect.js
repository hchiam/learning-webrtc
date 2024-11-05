import firebaseConfig from "./firebase-db-config.json";

export class RoomConnector {
  constructor(roomId) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.roomId = roomId;
    this.roomRef = firebase.database().ref(`rooms/${roomId}`);
  }

  // User A: Create a room and wait for another user
  async createRoom() {
    await this.roomRef.set({
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      status: "waiting",
    });

    // Wait for someone to join
    return new Promise((resolve) => {
      this.roomRef.child("status").on("value", (snapshot) => {
        if (snapshot.val() === "ready") {
          resolve();
        }
      });
    });
  }

  // User B: Join an existing room
  async joinRoom() {
    const room = await this.roomRef.get();
    if (!room.exists()) {
      throw new Error("Room not found");
    }

    await this.roomRef.update({ status: "ready" });
    return true;
  }

  // Clean up
  disconnect() {
    this.roomRef.off();
    this.roomRef.remove();
  }
}
