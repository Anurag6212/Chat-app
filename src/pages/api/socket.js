import { Server } from "socket.io";
// import messageHandler from "../../utils/sockets/messageHandler";

const users = [];
export default function SocketHandler(req, res) {
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket) => {
    socket.on("joined", (data) => {
      users[socket.id] = data?.user;

      socket.broadcast.emit("userJoined", {
        user: "Admin",
        message: `${users[socket.id]} has joined`,
        date: Date.now(),
      });
      socket.emit("welcome", {
        user: "Admin",
        message: `Welcome to the chat,${users[socket.id]}`,
        date: Date.now(),
      });
    });

    socket.on("message", (data) => {
      io.emit("sendMessage", {
        user: users[data?.id],
        message: data?.message,
        id: data?.id,
        date: Date.now(),
      });
    });
    if (users[socket.id]) {
      socket.on("disUser", () => {
        socket.broadcast.emit("leave", {
          user: "admin",
          message: `${users[socket.id]} has left`,
          date: Date.now(),
        });
      });
    }
    // messageHandler(io, socket);
  };

  // Define actions inside
  io.on("connection", onConnection);

  console.log("Setting up socket");
  res.end();
}
