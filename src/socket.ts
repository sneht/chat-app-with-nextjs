"use client";

import { io } from "socket.io-client";

// Replace this with your actual server URL
const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const socket = io(SERVER_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

// Function to connect the socket
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

socket.on("message_sent", (data) => {
  console.log("data from socket ts file", data);
});

// Function to disconnect the socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
