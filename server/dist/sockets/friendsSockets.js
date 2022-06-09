"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendsSockets = void 0;
const models_1 = require("../db/models");
const setup_1 = require("../setup");
const friendsSockets = (socket) => {
    socket.on('addFriend', async (login, friendName) => {
        const user = await models_1.Users.findOne({
            where: {
                login: friendName
            }
        });
        if (user === null || user === void 0 ? void 0 : user.socket_id)
            socket.broadcast.to(user.socket_id).emit('friendInvite', login);
    });
    socket.on('friendAdded', async (login, friendName) => {
        const user = await models_1.Users.findOne({
            where: {
                login: friendName
            }
        });
        if (user === null || user === void 0 ? void 0 : user.socket_id) {
            setup_1.io.to(user.socket_id).emit('friendAdded');
            setup_1.io.to(socket.id).emit('friendAdded');
        }
    });
    socket.on('removeFriend', async (login, friendName) => {
        const user = await models_1.Users.findOne({
            where: {
                login: friendName
            }
        });
        if (user === null || user === void 0 ? void 0 : user.socket_id)
            socket.broadcast.to(user.socket_id).emit('removeFriend');
    });
    socket.on('inviteInLobby', async (friendName, invite_id) => {
        const user = await models_1.Users.findOne({
            where: {
                login: friendName
            }
        });
        if (user === null || user === void 0 ? void 0 : user.socket_id)
            socket.broadcast.to(user.socket_id).emit('inviteInLobby', invite_id);
    });
};
exports.friendsSockets = friendsSockets;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJpZW5kc1NvY2tldHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb2NrZXRzL2ZyaWVuZHNTb2NrZXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHlDQUFxQztBQUNyQyxvQ0FBOEI7QUFFdkIsTUFBTSxjQUFjLEdBQUcsQ0FBQyxNQUF5RSxFQUFFLEVBQUU7SUFDMUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLEtBQWEsRUFBRSxVQUFrQixFQUFFLEVBQUU7UUFDakUsTUFBTSxJQUFJLEdBQUcsTUFBTSxjQUFLLENBQUMsT0FBTyxDQUFDO1lBQy9CLEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsVUFBVTthQUNsQjtTQUNGLENBQUMsQ0FBQTtRQUNGLElBQUcsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFNBQVM7WUFDaEIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDcEUsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsS0FBYSxFQUFFLFVBQWtCLEVBQUUsRUFBRTtRQUNuRSxNQUFNLElBQUksR0FBRyxNQUFNLGNBQUssQ0FBQyxPQUFPLENBQUM7WUFDL0IsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxVQUFVO2FBQ2xCO1NBQ0YsQ0FBQyxDQUFBO1FBQ0YsSUFBRyxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsU0FBUyxFQUFDO1lBQ2pCLFVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMxQyxVQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDdEM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxLQUFhLEVBQUUsVUFBa0IsRUFBRSxFQUFFO1FBQ3BFLE1BQU0sSUFBSSxHQUFHLE1BQU0sY0FBSyxDQUFDLE9BQU8sQ0FBQztZQUMvQixLQUFLLEVBQUU7Z0JBQ0wsS0FBSyxFQUFFLFVBQVU7YUFDbEI7U0FDRixDQUFDLENBQUE7UUFDRixJQUFHLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxTQUFTO1lBQ2hCLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUUsVUFBa0IsRUFBRSxTQUFpQixFQUFFLEVBQUU7UUFDekUsTUFBTSxJQUFJLEdBQUcsTUFBTSxjQUFLLENBQUMsT0FBTyxDQUFDO1lBQy9CLEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsVUFBVTthQUNsQjtTQUNGLENBQUMsQ0FBQTtRQUNGLElBQUcsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFNBQVM7WUFDaEIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDekUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUE7QUF4Q1ksUUFBQSxjQUFjLGtCQXdDMUIifQ==