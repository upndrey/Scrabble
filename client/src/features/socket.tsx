import io from "socket.io-client";
import { SERVER_IP } from "./server";

export const socket = io(SERVER_IP);