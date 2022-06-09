"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lobbySockets = void 0;
const models_1 = require("../db/models");
const setup_1 = require("../setup");
const lobbySockets = (socket) => {
    socket.on('room', async (room) => {
        if (room) {
            socket.join(room);
            socket.broadcast.to(room).emit('newUser', room);
        }
    });
    socket.on('removeRoom', async (room) => {
        if (room) {
            socket.broadcast.to(room).emit('removedFromLobby');
            setup_1.io.in(room).socketsLeave(room);
        }
    });
    socket.on('leaveRoom', (room) => {
        socket.leave(room);
    });
    socket.on('removeFromRoom', async (user_id) => {
        const user = await models_1.Users.findOne({
            where: {
                id: user_id
            }
        });
        if (user === null || user === void 0 ? void 0 : user.socket_id)
            socket.broadcast.to(user.socket_id).emit('removedFromLobby');
    });
};
exports.lobbySockets = lobbySockets;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9iYnlTb2NrZXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc29ja2V0cy9sb2JieVNvY2tldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEseUNBQXFDO0FBQ3JDLG9DQUE4QjtBQUV2QixNQUFNLFlBQVksR0FBRyxDQUFDLE1BQXlFLEVBQUUsRUFBRTtJQUN4RyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBWSxFQUFFLEVBQUU7UUFDdkMsSUFBRyxJQUFJLEVBQUM7WUFDTixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDakQ7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLEtBQUssRUFBRSxJQUFZLEVBQUUsRUFBRTtRQUM3QyxJQUFHLElBQUksRUFBQztZQUNOLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ25ELFVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQVksRUFBRSxFQUFFO1FBQ3RDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckIsQ0FBQyxDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxPQUFlLEVBQUUsRUFBRTtRQUNwRCxNQUFNLElBQUksR0FBRyxNQUFNLGNBQUssQ0FBQyxPQUFPLENBQUM7WUFDL0IsS0FBSyxFQUFFO2dCQUNMLEVBQUUsRUFBRSxPQUFPO2FBQ1o7U0FDRixDQUFDLENBQUE7UUFDRixJQUFHLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxTQUFTO1lBQ2hCLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNqRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQTtBQTNCWSxRQUFBLFlBQVksZ0JBMkJ4QiJ9