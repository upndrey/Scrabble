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
import crypto from 'crypto'
import Players from "./models/Players";
import Maps from "./models/Maps";
import Sets from "./models/Sets";
import Fields from "./models/Fields";
import Games from "./models/Games";

// Encrypt options
const saltRounds = 10;

// Session types
declare module 'express-session' {
  interface Session {
    user: Users;
    lobby: Lobbies;
    player: Players;
  }
}

// Db setup
associate();
// init();
Maps.generateMap();

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
  let status = 400;
  const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds)
  const inviteId = crypto.randomBytes(8).toString("hex");
  try{
    const lobby = await Lobbies.create({
      host_id: req.session.user.id,
      name: req.body.name,
      is_private: req.body.is_private,
      max_players: req.body.max_players,
      password: encryptedPassword,
      invite_id: inviteId
    });
    if(!lobby) 
      throw true;

    const player = await Players.create({
      user_id: req.session.user.id,
      lobby_id: lobby.id,
      is_host: false,
      slot: 1
    });
    if(!player) 
      throw true;

    req.session.lobby = lobby;
    req.session.player = player;
    status = 200;
  }
  catch(err) {
    status = 422;
  }
  finally {
    res.status(status);
    res.json({
      invite_id: inviteId
    });
  }
});

app.get('/api/inviteLink/:id', async (req, res) => {
  let status = 400;
  try{
    const lobby = await Lobbies.findOne({
      where: {
        invite_id: req.params.id
      }
    });
    if(!lobby) 
      throw true;
    
    const { count, rows } = await Players.findAndCountAll({
      where: {
        lobby_id: lobby.id
      }
    });
    if(count > 3)
      throw true;
    let freeSlotsArray = [true, true, true, true];
    for(let i = 0; i < rows.length; i++) {
      freeSlotsArray[rows[i].slot - 1] = false;
    }
    let freeSlotId = 0;
    for(let i = 0; i < freeSlotsArray.length; i++) {
      if(freeSlotsArray[i]) {
        freeSlotId = i;
        break;
      }
    }
    const player = await Players.create({
      user_id: req.session.user.id,
      lobby_id: lobby.id,
      is_host: false,
      slot: freeSlotId + 1
    });
    if(!player) 
      throw true;
    
    req.session.lobby = lobby;
    req.session.player = player;
    status = 200;
     
  }
  catch(err) {
    status = 422;
  }
  finally {
    res.status(status);
    // res.json({});
    res.redirect('http://localhost:3001/lobby');
  }
})

app.post('/api/getUserData', async (req, res) => {
  let status = 400;
  let login = "";
  let lobby = null;
  let game: any = null;
  let lobbyBd;
  try {
    
    if (!req.session.user) 
      throw 422;
    
    login = req.session.user.login;
    if (req.session.lobby) {
      lobbyBd = req.session.lobby;
    }
    else {
      const player = await Players.findOne({
        where: {
          user_id: req.session.user.id,
        }
      });
      if(!player)
        throw 200;
      
      lobbyBd = await Lobbies.findOne({
        where: {
          id: player.lobby_id,
        }
      });
    }
    if(!lobbyBd)
      throw 422;
    req.session.lobby = lobbyBd;
    const players = await Users.findAll({
      attributes: [
        'login',
        'id'
      ],
      include: [{
        attributes: ['user_id','points', 'is_host', 'slot'],
        model: Players,
        as: 'player',
        required: true,
        where: {
          lobby_id: lobbyBd.id
        }
      }]
    });
    if(!players)
      throw 422;
      
    lobby = {
      name: lobbyBd.name,
      max_players: lobbyBd.max_players,
      invite_id: lobbyBd.invite_id,
      players
    };

    const gameBd = await Games.findOne({
      attributes: ['id', 'turn', 'is_closed'],
      where: {
        lobby_id: req.session.lobby.id
      }
    });
    if(!gameBd)
      throw 200;
    game = {};
    game.gameInfo = gameBd;
    const {set, symbols} = await Sets.generateRuSet();
    if(!set)
      throw 422;
    game.symbols = symbols;

    const {map, mapCells} = await Maps.generateMap();
    if(!map)
      throw 422;
    game.mapCells = mapCells;

    const {field, fieldCells} = await Fields.generateField(gameBd.id);
    if(!field)
      throw 422;
    game.fieldCells = fieldCells;

    status = 200;
  }
  catch(err) {
    console.log(err);
    if(err == 200)
      status = 200;
    else
      status = 422;
  }
  finally {
    res.status(status);
    res.json({login, lobby, game});
  }
  
});


app.post('/api/startGame', async (req, res) => {
  let status = 400;
  let game = null;
  let symbolsArray = null;
  let mapCellsArray = null;
  let fieldCellsArray = null;
  try {
    const {set, symbols} = await Sets.generateRuSet();
    if(!set)
      throw true;
    symbolsArray = symbols;
    const {map, mapCells} = await Maps.generateMap();
    if(!map)
      throw true;
    mapCellsArray = mapCells;
    game = await Games.create({
      lobby_id: req.session.lobby.id,
      set_id: set[0].id,
      map_id: map[0].id,
    });
    
    if(!game)
      throw true;

    const {field, fieldCells} = await Fields.generateField(game.id);
    if(!field)
      throw true;
    fieldCellsArray = fieldCells;
    status = 200;
  }
  catch(err) {
    console.log(err);
    status = 422;
  }
  finally {
    res.status(status);
    res.json({
      game, 
      symbolsArray,
      mapCellsArray,
      fieldCellsArray
    });
  }
});

app.post('/api/login', async (req, res) => {
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
        req.session.user = user;
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
    res.status(status);
    res.json({});
  }
});

app.post('/api/logout', async (req, res) => {
  let status = 200;
  req.session.destroy((err) => {
    status = 422;
  });
  res.status(status);
  res.json({});
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
      if (!req.session.user) 
        req.session.user = user[0]
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
    res.status(status)
    res.json({});
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