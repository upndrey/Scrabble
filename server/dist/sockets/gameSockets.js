"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameSockets = void 0;
const setup_1 = require("../setup");
const gameSockets = (socket) => {
    socket.on('startGame', (room) => {
        socket.broadcast.to(room).emit('startGame');
    });
    socket.on('nextTurn', (room) => {
        socket.broadcast.to(room).emit('nextTurn');
    });
    socket.on('gameMove', (room) => {
        if (room)
            setup_1.io.in(room).emit('gameMove');
    });
};
exports.gameSockets = gameSockets;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZVNvY2tldHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb2NrZXRzL2dhbWVTb2NrZXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLG9DQUE4QjtBQUV2QixNQUFNLFdBQVcsR0FBRyxDQUFDLE1BQXlFLEVBQUUsRUFBRTtJQUN2RyxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQVksRUFBRSxFQUFFO1FBQ3RDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM5QyxDQUFDLENBQUMsQ0FBQTtJQUNGLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBWSxFQUFFLEVBQUU7UUFDckMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFBO0lBQ0YsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUF3QixFQUFFLEVBQUU7UUFDakQsSUFBRyxJQUFJO1lBQ0wsVUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakMsQ0FBQyxDQUFDLENBQUE7QUFFSixDQUFDLENBQUE7QUFaWSxRQUFBLFdBQVcsZUFZdkIifQ==