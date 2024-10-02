const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

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

    socket.on("join_room",async(data)=>{
      const result = await getRecentMessagesForGroupAction(chat.id);
        
      console.log("data from server js file for join room", data);
    })

    socket.on("message_sent", (data) => {
      console.log("data from server js file", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    // Add your socket event handlers here
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
