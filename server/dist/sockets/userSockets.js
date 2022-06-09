"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSockets = void 0;
const models_1 = require("../db/models");
const userSockets = (socket) => {
    socket.on('login', async (login, socket_id) => {
        const user = await models_1.Users.findOne({
            where: {
                login: login
            }
        });
        await (user === null || user === void 0 ? void 0 : user.update({
            socket_id: socket_id
        }));
        // socket.broadcast.to(room).emit('newUser', room);
    });
};
exports.userSockets = userSockets;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlclNvY2tldHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb2NrZXRzL3VzZXJTb2NrZXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHlDQUFxQztBQUU5QixNQUFNLFdBQVcsR0FBRyxDQUFDLE1BQXlFLEVBQUUsRUFBRTtJQUN2RyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBYSxFQUFFLFNBQWlCLEVBQUUsRUFBRTtRQUM1RCxNQUFNLElBQUksR0FBRyxNQUFNLGNBQUssQ0FBQyxPQUFPLENBQUM7WUFDL0IsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxLQUFLO2FBQ2I7U0FDRixDQUFDLENBQUE7UUFDRixNQUFNLENBQUEsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sQ0FBQztZQUNqQixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDLENBQUEsQ0FBQTtRQUNGLG1EQUFtRDtJQUNyRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQTtBQVpZLFFBQUEsV0FBVyxlQVl2QiJ9