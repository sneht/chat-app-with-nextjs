// const { Socket } = require("socket.io-client");
// const { DefaultEventsMap } = require("socket.io");
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
// import { getRecentMessagesForGroupAction } from "./app/actions/groupActions";

// import { getRecentMessagesForGroupAction } from "./app/actions/groupActions";
// const {getRecentMessagesForGroupAction}=require("..//")
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("A user connected at server js file ");

    socket.on("join_room", async (data) => {
      const { group_id } = data || {};
      socket.join(group_id);
      // const result = await getRecentMessagesForGroupAction(group_id);

      console.log("data from server js file for join room", data);
    });

    socket.on("message_sent", (data) => {
      console.log("data from server js file", data);
      const { to } = data || {};
      io.in(to).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
