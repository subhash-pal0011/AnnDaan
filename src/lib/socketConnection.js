import { io } from "socket.io-client";

let socket = null;

export const socketConnection = () => {
       if (!socket) {
              socket = io(process.env.NEXT_PUBLIC_NODE_SOCKET_URL, {
                     transports: ["websocket"],
              });
       }
       return socket;
};