import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Users } from "../db/models";
import { io } from "../setup";

export const lobbySockets = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  socket.on('room', async (room: string) => {
    if(room){
      socket.join(room);
      socket.broadcast.to(room).emit('newUser', room);
    }
  });

  socket.on('removeRoom', async (room: string) => {
    if(room){
      socket.broadcast.to(room).emit('removedFromLobby');
      io.in(room).socketsLeave(room);
    }
  });
  socket.on('leaveRoom', (room: string) => {
    socket.leave(room);
  })

  socket.on('removeFromRoom', async (user_id: number) => {
    const user = await Users.findOne({
      where: {
        id: user_id
      }
    })
    if(user?.socket_id)
      socket.broadcast.to(user.socket_id).emit('removedFromLobby');
  });
}