import { RoomConnector } from "./connect.js";

document.querySelector("#createRoom").addEventListener("click", createNewRoom);

document.querySelector("#joinRoom").addEventListener("click", joinExistingRoom);

function showStatus(message) {
  document.getElementById("status").textContent = message;
}

async function createNewRoom() {
  const roomId = Math.random().toString(36).substr(2, 9);
  document.getElementById("roomId").value = roomId;

  showStatus(`Room created: ${roomId}. Waiting for someone to join...`);

  const room = new RoomConnector(roomId);
  await room.createRoom();

  showStatus(`Someone joined room ${roomId}! We are connected!`);
}

async function joinExistingRoom() {
  const roomId = document.getElementById("roomId").value;
  if (!roomId) {
    showStatus("Please enter a room ID");
    return;
  }

  try {
    const room = new RoomConnector(roomId);
    await room.joinRoom();
    showStatus(`Successfully joined room ${roomId}!`);
  } catch (error) {
    showStatus(`Error: ${error.message}`);
  }
}
