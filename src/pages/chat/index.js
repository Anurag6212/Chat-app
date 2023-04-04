import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/chat.module.css";
import { useEffect, useRef, useState } from "react";
import io from "Socket.IO-client";
import { useRouter } from "next/router";

const index = () => {
  const router = useRouter();
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [id, setId] = useState(null);
  const chatBodyRef = useRef();

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.emit("disUser");
      newSocket.off();
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socketInitializer(socket);
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("sendMessage", (data) => {
        setMessageList((prevState) => [...prevState, data]);
        console.log(data.user, data.message);
      });
    }
    console.log(messageList);

    return () => {
      if (socket) {
        socket.off();
      }
    };
  }, [messageList]);

  const socketInitializer = async (socket) => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
      setId(socket.id);
    });

    if (router.query?.name) {
      socket.emit("joined", {
        user: router.query?.name,
      });
    }
    socket.on("welcome", (data) => {
      setMessageList((prevState) => [...prevState, data]);
      console.log(data?.user, data?.message);
    });

    socket.on("userJoined", (data) => {
      setMessageList((prevState) => [...prevState, data]);
      console.log(data?.user, data?.message);
    });

    socket.on("leave", (data) => {
      setMessageList((prevState) => [...prevState, data]);
      console.log(data?.user, data?.message);
    });
  };

  const send = () => {
    socket.emit("message", { message, id });
    setMessage("");
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  };

  return (
    <div className={styles["chat-container"]}>
      <div className={styles["chat-header"]}>
        <h2>Chat App</h2>
        <p>Online</p>
      </div>
      <div className={styles["chat-body"]} ref={chatBodyRef}>
        {messageList.map((res) => {
          let time = new Date(res?.date);
          time = time.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });

          return res.id === id ? (
            <div key={res?.message} className={styles["chat-message-outgoing"]}>
              <div className={styles["message-text"]}>
                <p>
                  {res?.user === "Admin" ? res?.message : "You: " + res.message}
                </p>
                <span className={styles["time"]}>{time}</span>
              </div>
              {/* <img src="https://via.placeholder.com/50" alt="Avatar" /> */}
            </div>
          ) : (
            <div key={res?.message} className={styles["chat-message-incoming"]}>
              {/* <img src="https://via.placeholder.com/50" alt="Avatar" /> */}
              <div className={styles["message-text"]}>
                <p>
                  {res?.user === "Admin"
                    ? res?.message
                    : res?.user + ": " + res.message}
                </p>
                <span className={styles["time"]}>{time}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles["chat-footer"]}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              send();
            }
          }}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
};

export default index;
