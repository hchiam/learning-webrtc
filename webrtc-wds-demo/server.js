const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

server.listen(3000);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  const roomId = uuidV4();
  res.redirect(`/${roomId}`);
});

app.get("/:room", (req, res) => {
  // :room -> req.params.room
  res.render("room", { roomId: req.params.room }); // go to room.ejs
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.on("ready", () => {
      socket.broadcast.to(roomId).emit("user-connected", userId);
    });
    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });
});
