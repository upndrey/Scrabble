import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { io } from "../setup";

export const gameSockets = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  socket.on('startGame', (room: string) => {
    socket.broadcast.to(room).emit('startGame');
  })
  socket.on('nextTurn', (room: string) => {
    socket.broadcast.to(room).emit('nextTurn');
  })
  socket.on('gameMove', (room: string | undefined) => {
    if(room)
      socket.broadcast.to(room).emit('gameMove');
  })

}