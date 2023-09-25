import * as Amqp from "amqp-ts";
import io from "socket.io-client";

export const socket = io.connect("http://localhost:3001");

const start = async () => {
  console.log("Task queue consumer listening...");
  const mqConnection = new Amqp.Connection("amqp://localhost");

  const exchange = await mqConnection.declareExchange("exchange");
  const queue = await mqConnection.declareQueue("queue");
  queue.bind(exchange);
  queue.activateConsumer((message) => {
    socket.emit("new queue message", message.getContent());
    console.log("Message received: " + JSON.stringify(message.getContent()));
    message.ack();
  });
};

start();
