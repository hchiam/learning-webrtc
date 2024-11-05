import { RoomConnector } from "./connect.js";

document.querySelector("#createRoom").addEventListener("click", createNewRoom);
document.querySelector("#joinRoom").addEventListener("click", joinExistingRoom);
document.querySelector("#sendMessage").addEventListener("click", sendMessage);

let currentRoom = null;

function showStatus(message) {
  document.getElementById("status").textContent = message;
}

function showMessage(message) {
  const messagesDiv = document.getElementById("messages");
  const messageEl = document.createElement("div");
  messageEl.textContent = message;
  messagesDiv.appendChild(messageEl);
}

function enableMessageArea() {
  document.getElementById("messageArea").style.display = "block";
}

async function createNewRoom() {
  const roomId = Math.random().toString(36).substr(2, 9);
  document.getElementById("roomId").value = roomId;

  showStatus(`Room created: ${roomId}. Waiting for someone to join...`);

  currentRoom = new RoomConnector(roomId);
  currentRoom.onMessage((msg) => showMessage(`Peer: ${msg}`));
  await currentRoom.createRoom();

  showStatus(`Connected in room ${roomId}!`);
  enableMessageArea();
}

async function joinExistingRoom() {
  const roomId = document.getElementById("roomId").value;
  if (!roomId) {
    showStatus("Please enter a room ID");
    return;
  }

  try {
    currentRoom = new RoomConnector(roomId);
    currentRoom.onMessage((msg) => showMessage(`Peer: ${msg}`));

    await currentRoom.joinRoom(); // This now waits for connection to open
    showStatus(`Connected in room ${roomId}!`);
    enableMessageArea();
  } catch (error) {
    showStatus(`Error: ${error.message}`);
    console.error("Connection error:", error);
  }
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value;

  if (currentRoom && message) {
    if (currentRoom.sendMessage(message)) {
      showMessage(`Me: ${message}`);
      input.value = "";
    } else {
      showMessage("Not connected yet...");
    }
  }
}

// Clean up on page close
window.addEventListener("unload", () => {
  if (currentRoom) {
    currentRoom.disconnect();
  }
});
