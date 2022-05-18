import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import * as http from 'http';
import cors from 'cors';
import { associate } from "./db/associations";
import { init } from "./db/init";
import Lobbies from "./models/Lobbies";
import session from 'express-session';
const redisStorage = require('connect-redis')(session);
import redis from 'redis';
const client = redis.createClient();

const host = '127.0.0.1'
const port = 3000
// db
// associate();
// init();

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

app.use(
  session({
    store: new redisStorage({
      host: host,
      port: 6379,
      client: client,
    }),
    secret: 'NwthgxCo',
    saveUninitialized: true,
  })
)

app.post('/api/createLobby', async (req, res) => {
  await Lobbies.create({});
});

app.post('/api/signup', async (req, res) => {
  console.log(req.body);
  return res.json("test");
});

const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: "http://localhost:3001"
    }
 });

io.on("connection", (socket) => {
  // ...
  console.log('runningMessage');
});

httpServer.listen(port);