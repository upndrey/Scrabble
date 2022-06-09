import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Users } from "../db/models";
import { io } from "../setup";

export const friendsSockets = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  socket.on('addFriend', async (login: string, friendName: string) => {
    const user = await Users.findOne({
      where: {
        login: friendName
      }
    })
    if(user?.socket_id)
      socket.broadcast.to(user.socket_id).emit('friendInvite', login);
  });
  socket.on('friendAdded', async (login: string, friendName: string) => {
    const user = await Users.findOne({
      where: {
        login: friendName
      }
    })
    if(user?.socket_id){
      io.to(user.socket_id).emit('friendAdded');
      io.to(socket.id).emit('friendAdded');
    }
  });
  socket.on('removeFriend', async (login: string, friendName: string) => {
    const user = await Users.findOne({
      where: {
        login: friendName
      }
    })
    if(user?.socket_id)
      socket.broadcast.to(user.socket_id).emit('removeFriend');
  });
  
  socket.on('inviteInLobby', async (friendName: string, invite_id: string) => {
    const user = await Users.findOne({
      where: {
        login: friendName
      }
    })
    if(user?.socket_id)
      socket.broadcast.to(user.socket_id).emit('inviteInLobby', invite_id);
  });
}