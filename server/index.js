import { createServer } from "http";
import { Server } from "socket.io";
import * as Amqp from "amqp-ts";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log("User connected: ", socket.id);

  const mqConnection = new Amqp.Connection("amqp://localhost");
  const exchange = await mqConnection.declareExchange("exchange");
  const queue = await mqConnection.declareQueue("queue");
  queue.bind(exchange);

  socket.on("NEW_MESSAGE", (data) => {
    console.log("Sending data to message queue...");
    const message = new Amqp.Message(data);
    exchange.send(message);
  });

  socket.on("identify", (data) => {
    console.log(`${data?.name} is connected...`);
    const message = new Amqp.Message(data);
    exchange.send(message);
  });

  socket.on("new queue message", (data) => {
    socket.broadcast.emit("RECEIVE_MESSAGE", data);
  });
});

httpServer.listen(3001);
