import { app, httpServer, io } from "./setup";

import { userRouter } from "./routers/userRounter";
import { friendsRouter } from "./routers/friendsRouter";
import { lobbyRouter } from "./routers/lobbyRouter";
import { gameRouter } from "./routers/gameRouter";

import { lobbySockets } from "./sockets/lobbySockets";
import { gameSockets } from "./sockets/gameSockets";
import { friendsSockets } from "./sockets/friendsSockets";
import { userSockets } from "./sockets/userSockets";



// Routes
app.use('/api/user', userRouter);
app.use('/api/friends', friendsRouter);
app.use('/api/lobby', lobbyRouter);
app.use('/api/game', gameRouter);

// Sockets
io.on("connection", (socket) => {
  lobbySockets(socket)

  gameSockets(socket)
  
  friendsSockets(socket)

  userSockets(socket);
});

// Server
httpServer.listen(3001);

