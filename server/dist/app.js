"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setup_1 = require("./setup");
const userRounter_1 = require("./routers/userRounter");
const friendsRouter_1 = require("./routers/friendsRouter");
const lobbyRouter_1 = require("./routers/lobbyRouter");
const gameRouter_1 = require("./routers/gameRouter");
const lobbySockets_1 = require("./sockets/lobbySockets");
const gameSockets_1 = require("./sockets/gameSockets");
const friendsSockets_1 = require("./sockets/friendsSockets");
const userSockets_1 = require("./sockets/userSockets");
// Routes
setup_1.app.use('/api/user', userRounter_1.userRouter);
setup_1.app.use('/api/friends', friendsRouter_1.friendsRouter);
setup_1.app.use('/api/lobby', lobbyRouter_1.lobbyRouter);
setup_1.app.use('/api/game', gameRouter_1.gameRouter);
// Sockets
setup_1.io.on("connection", (socket) => {
    (0, lobbySockets_1.lobbySockets)(socket);
    (0, gameSockets_1.gameSockets)(socket);
    (0, friendsSockets_1.friendsSockets)(socket);
    (0, userSockets_1.userSockets)(socket);
});
// Server
setup_1.httpServer.listen(3001);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQThDO0FBRTlDLHVEQUFtRDtBQUNuRCwyREFBd0Q7QUFDeEQsdURBQW9EO0FBQ3BELHFEQUFrRDtBQUVsRCx5REFBc0Q7QUFDdEQsdURBQW9EO0FBQ3BELDZEQUEwRDtBQUMxRCx1REFBb0Q7QUFJcEQsU0FBUztBQUNULFdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLHdCQUFVLENBQUMsQ0FBQztBQUNqQyxXQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSw2QkFBYSxDQUFDLENBQUM7QUFDdkMsV0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUseUJBQVcsQ0FBQyxDQUFDO0FBQ25DLFdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLHVCQUFVLENBQUMsQ0FBQztBQUVqQyxVQUFVO0FBQ1YsVUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtJQUM3QixJQUFBLDJCQUFZLEVBQUMsTUFBTSxDQUFDLENBQUE7SUFFcEIsSUFBQSx5QkFBVyxFQUFDLE1BQU0sQ0FBQyxDQUFBO0lBRW5CLElBQUEsK0JBQWMsRUFBQyxNQUFNLENBQUMsQ0FBQTtJQUV0QixJQUFBLHlCQUFXLEVBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEIsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFTO0FBQ1Qsa0JBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMifQ==