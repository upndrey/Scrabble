import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Users } from "../db/models";

export const userSockets = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  socket.on('login', async (login: string, socket_id: string) => {
    const user = await Users.findOne({
      where: {
        login: login
      }
    })
    await user?.update({
      socket_id: socket_id
    })
    // socket.broadcast.to(room).emit('newUser', room);
  });
}