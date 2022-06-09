import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { createClient } from "redis";
import * as http from 'http';
const connectRedis = require('connect-redis');
import { associate } from "./db/associations";
import { init } from "./db/init";
import { Users, Games, Lobbies, Players, Symbols } from './db/models';
import { CLIENT_ADDR } from './options';
import { Server } from "socket.io";

// Redis setup
const RedisStore = connectRedis(session)
const redisClient = createClient({
    host: 'localhost',
    port: 6379
})

redisClient.on('error', function (err: any) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err: any) {
    console.log('Connected to redis successfully');
});
export const store = new RedisStore({ client: redisClient });


// Express setup
export const app = express();
app.set('trust proxy', 1)
app.use(express.urlencoded());
app.use(express.json());

var corsOptions = {
  origin: CLIENT_ADDR,
  credentials: true, 
  exposedHeaders: ['set-cookie']
};
app.use(cors(corsOptions));

app.use(
  session({ 
    store: store,
    resave: true,
    secret: '123456', 
    cookie:{
      maxAge: 1000 * 60 * 60,
    },
    saveUninitialized: true
  })
);

// Session types
declare module 'express-session' {
  interface Session {
    user: Users;
    lobby: Lobbies;
    player: Players;
    game: Games;
    symbols: Symbols[] | null;
  }
}

export const httpServer = http.createServer(app);

// Db setup
associate();
// init(); // используется для создания бд при переносе на новый сервер

// Socket setup
export const io = new Server(httpServer, { 
  cors: {
      origin: CLIENT_ADDR
  }
});