import { useEffect, useState } from "react";
import io from "socket.io-client";

function NewConnection({ name }) {
  return <div>{name} is connected.</div>;
}

function NewMessage({ name, message }) {
  return (
    <div>
      <strong>{name}</strong>: {message}
    </div>
  );
}

const socket = io.connect("http://localhost:3001");

function ChatArea() {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState([]);
  const user = localStorage.getItem("mq-user");

  useEffect(() => {
    socket.on("RECEIVE_MESSAGE", (data) => {
      setEvents((current) => [...current, data]);
    });
  }, [socket]);

  useEffect(() => {
    socket.emit("identify", { name: user, type: "NEW_CONNECTION" });
  }, []);

  const renderEvent = (o) => {
    switch (o.type) {
      case "NEW_CONNECTION":
        return <NewConnection name={o.name} />;
      case "NEW_MESSAGE":
        return <NewMessage name={o.name} message={o.message} />;
    }
  };

  const sendMessage = () => {
    if (message) {
      socket.emit("NEW_MESSAGE", {
        type: "NEW_MESSAGE",
        name: user,
        message,
      });

      setMessage("");
    }
  };

  return (
    <div className="flex h-screen justify-center bg-gray-100 p-8">
      <div className="w-full md:w-1/2">
        <div className="mb-5 flex h-3/5 flex-col justify-end rounded border border-b-4 bg-white p-4">
          {events?.map((o, i) => {
            return <div key={i}>{renderEvent(o)}</div>;
          })}
        </div>

        <div className="mb-8 flex items-center">
          <input
            type="text"
            value={message}
            onChange={(ev) => setMessage(ev.target.value)}
            maxLength={100}
            className="grow"
            placeholder="Type your message here..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
