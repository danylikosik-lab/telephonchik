import { io, Socket } from "socket.io-client";

export type ClientSocket = Socket;

let socket: ClientSocket | null = null;

export function getSocket(): ClientSocket {
  if (!socket) {
    const host = window.location.hostname || "127.0.0.1";
    socket = io(`http://${host}:4000`, {
      transports: ["websocket"],
    });
  }
  return socket;
}

