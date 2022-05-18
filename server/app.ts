import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import * as http from 'http';
import cors from 'cors';
import { associate } from "./db/associations";
import { init } from "./db/init";
import Lobbies from "./models/Lobbies";
import session from 'express-session';
import bcrypt from 'bcrypt';
import Users from "./models/Users";

// Encrypt options
const saltRounds = 10;

// Session types
declare module 'express-session' {
  interface Session {
    login: string;
  }
}

// Db setup
// associate();
// init();

// Express setup
const app = express();
app.set('trust proxy', 1)
app.use(express.urlencoded());
app.use(express.json());

var corsOptions = {
  credentials: true, 
  origin: true,
  exposedHeaders: ['set-cookie']
};
app.use(cors(corsOptions));

// Session setup
app.use(
  session({ 
    resave: true,
    secret: '123456', 
    cookie:{
      maxAge:36000,
      secure: false,
    },
    saveUninitialized: true
  })
);


// Routing
app.post('/api/createLobby', async (req, res) => {
  console.log("test3", req.sessionID)
  if (req.session.login) 
    console.log(req.session.login)
  res.status(200);
  res.json({});
  res.end();
});

app.post('/api/getUser', async (req, res) => {
  console.log("test1", req.sessionID);
  let status = 400;
  let login = "";
  if (req.session.login) {
    status = 200;
    login = req.session.login;
  }
  else {
    status = 422;
  }
  res.status(status);
  res.json({login});
  res.end();
});

app.post('/api/login', async (req, res) => {
  console.log("test2", req.sessionID);
  let status = 400;
  try {
    const user = await Users.findOne({
      where: {
        login: req.body.login
      }
    });
    if(user) {
      const compareResult = 
        await bcrypt.compare(req.body.password, user.password)
      if(compareResult) {
        req.session.login = user.login;
        status = 200;
      }
      else
        status = 422;
    }
    else
      status = 422;
  }
  catch(err) {
    status = 422;
  }
  finally {
    console.log(status);
    res.status(status);
    res.json({});
    res.end();
  }
});

app.post('/api/logout', async (req, res) => {
  let status = 200;
  req.session.destroy((err) => {
    status = 422;
  });
  console.log(status);
  res.status(status);
  res.json({});
  res.end();
});

app.post('/api/signup', async (req, res) => {
  let status = 400;
  const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds)
  try {
    const user = await Users.findOrCreate({
      where: {
        login: req.body.login
      },
      defaults: {
        login: req.body.login,
        password: encryptedPassword
      }
    });
    if(user[1]) {
      status = 200;
      console.log(req.session);
      if (!req.session.login) 
        req.session.login = req.body.login
    }
    else {
      status = 422;
    }
  }
  catch(err) {
    console.log(err);
    status = 422;
  }
  finally {
    console.log(status)
    res.status(status)
    res.json({});
    res.end();
  }
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

httpServer.listen(3000);