import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Op } from "sequelize";
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
import Symbols from "./models/Symbols";
import Hands from "./models/Hands";
import FieldCells from "./models/FieldCells";
import { createClient } from "redis";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Friends from "./models/Friends";
const connectRedis = require('connect-redis');


// Encrypt options
const saltRounds = 10;

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

// Db setup
associate();
// init();
// Maps.generateMap();

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


const RedisStore = connectRedis(session)
//Configure redis client
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

const store = new RedisStore({ client: redisClient });

// Session setup
app.use(
  session({ 
    store: store,
    resave: true,
    secret: '123456', 
    cookie:{
      maxAge: 1000 * 60 * 60,
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

    const hand = await Hands.create({
      player_id: player.id
    });
    if(!hand) 
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

app.post('/api/closeLobby', async (req, res) => {
  let status = 400;
  try{
    const lobby = await Lobbies.findOne({
      where: {
        invite_id: req.body.invite_id
      }
    });
    if(!lobby) 
      throw true;

    await lobby.destroy();

    req.session.lobby = null!;
    req.session.player = null!;
    status = 200;
  }
  catch(err) {
    
    status = 422;
  }
  finally {
    res.status(status);
    res.json({});
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
    const player = await Players.findOrCreate({
      where: {
        user_id: req.session.user.id,
        lobby_id: lobby.id,
      },
      defaults: {
        user_id: req.session.user.id,
        lobby_id: lobby.id,
        is_host: false,
        slot: freeSlotId + 1
      }
    });
    if(!player) 
      throw true;
    
    const hand = await Hands.create({
      player_id: player[0].id
    });
    if(!hand) 
      throw true;

    req.session.lobby = lobby;
    req.session.player = player[0];
    status = 200;
  }
  catch(err) {
    status = 422;
  }
  finally {
    res.status(status);
    // res.json({});
    res.redirect('http://localhost:3001/lobby?' + req.params.id);
  }
})

app.post('/api/removeFromLobby', async (req, res) => {
  let status = 400;
  try{
    const player = await Players.findOne({
      where: {
        user_id: req.body.player_id
      }
    });
    if(!player)
      throw true;
    
    const hand = await Hands.findOne({
      where: {
        player_id: player.id
      }
    });
    if(!hand) 
      throw true;

    await hand.destroy()
    await player.destroy()
    status = 200;
  }
  catch(err) {

    status = 422;
  }
  finally {
    res.status(status);
    res.json({});
  }
})


app.post('/api/removeLobbyData', async (req, res) => {
  req.session.lobby = null!;
  res.status(200);
  res.json({});
})

app.post('/api/getUserData', async (req, res) => {
  let status = 400;
  let login = "";
  let lobby = null;
  let game: any = null;
  let lobbyBd;
  try {
    if (!req.session.user) 
      throw 200;
    
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
      req.session.player = player;
      
      lobbyBd = await Lobbies.findOne({
        where: {
          id: player.lobby_id,
        }
      });
    }
    if(!lobbyBd)
      throw 422;
    req.session.lobby = lobbyBd;
    const players = await Players.findAll({
      attributes: ['user_id','points', 'is_host', 'slot', 'is_ended'],
      where: {
        lobby_id: lobbyBd.id
      },
      include: [{
          attributes: [
            'id',
            'login'
          ],
          model: Users,
          as: 'player',
          required: true
        },{
          attributes: ['slot1','slot2', 'slot3', 'slot4', 'slot5', 'slot6', 'slot7'],
          model: Hands,
          as: 'hand',
          required: true
        },
      ]
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
    const {set, symbols} = await Sets.getSet(gameBd.id);
    if(!set)
      throw 422;
    game.symbols = symbols;
    req.session.game = gameBd;

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
  try {

    const {map} = await Maps.generateMap();
    if(!map)
      throw true;

    const game = await Games.create({
      lobby_id: req.session.lobby.id,
      map_id: map[0].id,
    });
    if(!game)
      throw true;
    req.session.game = game;
    const {set, symbols} = await Sets.generateRuSet(game.id);
    if(!set)
      throw true;
    const {field} = await Fields.generateField(game.id);
    if(!field)
      throw true;

    const allPlayers = await Players.findAll({
      where: {
        lobby_id: req.session.lobby.id,
      },
    });
      
    const setResult = await Sets.getSet(game.id, true);
    if(!setResult || !setResult.symbols)
      throw true;

    shuffle(setResult.symbols);

    for(let i = 0; i < allPlayers.length; i++) {
      await allPlayers[i].update({
        points: 0
      });
      const hand = await Hands.findOne({
        where: {
          player_id: allPlayers[i].id
        }
      });
      if(setResult?.symbols && hand)
        await fillHand(setResult.symbols, hand);
    }
    
    status = 200;
  }
  catch(err) {
    status = 422;
  }
  finally {
    res.status(status);
    res.json({});
  }
});

function findSlotByTurn(turn: number, playersCount: number) {
  let slot = 1;
  switch(turn % playersCount) {
    case 0:
      slot = 1;
      break;
    case 1:
      slot = 2;
      break;
    case 2:
      slot = 3;
      break;
    case 3:
      slot = 4;
      break;
  }
  return slot;
}

function shuffle(array: Array<any>) {
  array.sort(() => Math.random() - 0.5);
}

async function fillHand(symbols: Symbols[], currentHand: Hands) {
  try{ 
    let symbol = symbols.pop();
    if(symbol) {
      await currentHand.update({
        slot1: currentHand.slot1 ? currentHand.slot1 : symbol.id
      });
      await symbol.update({
        in_box: false
      });
    }
  
    symbol = symbols.pop();
    if(symbol) {
      await currentHand.update({
        slot2: currentHand.slot2 ? currentHand.slot2 : symbol.id
      });
      await symbol.update({
        in_box: false
      });
    }
  
    symbol = symbols.pop();
    if(symbol) {
      await currentHand.update({
        slot3: currentHand.slot3 ? currentHand.slot3 : symbol.id
      });
      await symbol.update({
        in_box: false
      });
    } 
  
    symbol = symbols.pop();
    if(symbol) {
      await currentHand.update({
        slot4: currentHand.slot4 ? currentHand.slot4 : symbol.id
      });
      await symbol.update({
        in_box: false
      });
    } 
  
    symbol = symbols.pop();
    if(symbol) {
      await currentHand.update({
        slot5: currentHand.slot5 ? currentHand.slot5 : symbol.id
      });
      await symbol.update({
        in_box: false
      });
    } 
  
    symbol = symbols.pop();
    if(symbol) {
      await currentHand.update({
        slot6: currentHand.slot6 ? currentHand.slot6 : symbol.id
      });
      await symbol.update({
        in_box: false
      });
    }
  
    symbol = symbols.pop();
    if(symbol) {
      await currentHand.update({
        slot7: currentHand.slot7 ? currentHand.slot7 : symbol.id
      });
      await symbol.update({
        in_box: false
      });
    }
  }
  catch(err) {
    
  }
}

app.post('/api/nextTurn', async (req, res) => {
  let status = 400;
  try {
    const game = await Games.findOne({
      where: {
        lobby_id: req.session.lobby.id
      }
    })
    if(!game)
      throw true;
      
    const allPlayers = await Players.findAll({
      where: {
        lobby_id: req.session.lobby.id,
      },
    });

    const currentPlayer = await Players.findOne({
      where: {
        lobby_id: req.session.lobby.id,
        slot: findSlotByTurn(game.turn, allPlayers.length)
      },
    });
    if(!currentPlayer)
      throw true;
    if(req.body.points) {
      await currentPlayer.update({
        points: currentPlayer.points + req.body.points
      })
    }
    const currentHand = await Hands.findOne({
      where: {
        player_id: currentPlayer.id
      }
    })

    if(!currentHand)
      throw true;
      
    const {set, symbols} = await Sets.getSet(game.id, true);
    if(!symbols)
      throw true;
    
    shuffle(symbols);

    await fillHand(symbols, currentHand);
    game.set({
      turn: game.turn + 1
    });
    await game.save();
    status = 200;
  }
  catch(err) {
    console.log(err);
    status = 422;
  }
  finally {
    res.status(status);
    res.json({});
  }
});

app.post('/api/noMoreWays', async (req, res) => {
  let status = 400;
  try {
    const player = await Players.findOne({
      where: {
        lobby_id: req.session.lobby.id,
        user_id: req.body.user_id
      },
    });
    if(!player)
      throw true;
    
    await player.update({
      is_ended: true
    });

    const playersWithTurns = await Players.findAll({
      where: {
        lobby_id: req.session.lobby.id,
        is_ended: false
      }
    });
    if(playersWithTurns.length === 0) {
      io.to(req.session.lobby.invite_id).emit('gameEnded');
    }
    status = 200;
  }
  catch(err) {
    status = 422;
  }
  finally {
    res.status(status);
    res.json({});
  }


});

app.post('/api/exitGame', async (req, res) => {
  let status = 400;
  try {
    const player = await Players.findOne({
      where: {
        lobby_id: req.session.lobby.id,
        user_id: req.body.user_id
      },
    });
    if(!player)
      throw true;

    const playerSlot = player.slot;
  
    const currentHand = await Hands.findOne({
      where: {
        player_id: player.id
      }
    })
    if(!currentHand)
      throw true;
    await currentHand.destroy();
    await player.destroy();

    const allPlayers = await Players.findAll({
      where: {
        lobby_id: req.session.lobby.id,
        slot: {
          [Op.gt]: playerSlot
        }
      },
    });

    allPlayers.forEach(async (row) => {
      await row.update({
        slot: row.slot - 1
      })
    });

    if(req.session.lobby)
      req.session.lobby = null!;
    if(req.session.game)
      req.session.game = null!;

    status = 200;
  }
  catch(err) {
    console.log(err);
    status = 422;
  }
  finally {
    res.status(status);
    res.json({});
  }
});

app.post('/api/removeSymbolInField', async (req, res) => {
  let status = 400;
  try {
    if(!req.session.game)
      throw true;

    const fieldCell = await FieldCells.findOne({
      where: {
        id: req.body.cellId
      }
    })
    if(!fieldCell)
      throw true;

        
      let toValue = null;
      if(req.body.toSlot) {
        const currentPlayer = await Players.findOne({
          where: {
            lobby_id: req.session.lobby.id,
            slot: findSlotByTurn(req.session.game.turn, req.session.lobby.max_players)
          },
        });

        if(!currentPlayer)
          throw true;
        
        const currentHand = await Hands.findOne({
          where: {
            player_id: currentPlayer.id
          }
        })
  
        if(!currentHand)
          throw true;

        switch(req.body.toSlot) {
          case 1: 
            toValue = currentHand.slot1;
            break;
          case 2: 
            toValue = currentHand.slot2;
            break;
          case 3: 
            toValue = currentHand.slot3;
            break;
          case 4: 
            toValue = currentHand.slot4;
            break;
          case 5: 
            toValue = currentHand.slot5;
            break;
          case 6: 
            toValue = currentHand.slot6;
            break;
          case 7: 
            toValue = currentHand.slot7;
            break;
        }
      }
      else if(req.body.toCell) {
        const fieldCell = await FieldCells.findOne({
          where: {
            id: req.body.toCell
          }
        });
        toValue = fieldCell?.symbol_id;
      }

    await fieldCell?.update({
      symbol_id: toValue
    });
    
    status = 200;
  }
  catch(err) {
    console.log(err);
    status = 422;
  }
  finally {
    res.status(status);
    res.json({});
  }
});

app.post('/api/insertSymbolInField', async (req, res) => {
  let status = 400;
  try {
    if(!req.session.game)
      throw true;

    const fieldCell = await FieldCells.findOne({
      where: {
        id: req.body.cellId
      }
    })
    if(!fieldCell)
      throw true;

    await fieldCell?.update({
      symbol_id: req.body.symbolId
    });
    
    status = 200;
  }
  catch(err) {
    
    status = 422;
  }
  finally {
    res.status(status);
    res.json({});
  }
});

app.post('/api/removeSymbolInHand', async (req, res) => {
  let status = 400;
  try {
    if(!req.session.game)
      throw true;

    const currentPlayer = await Players.findOne({
      where: {
        lobby_id: req.session.lobby.id,
        slot: findSlotByTurn(req.session.game.turn, req.session.lobby.max_players)
      },
    });
    if(!currentPlayer)
      throw true;

    const currentHand = await Hands.findOne({
      where: {
        player_id: currentPlayer.id
      }
    })

    if(!currentHand)
      throw true;

    let toValue = null;
    if(req.body.toSlot) {
      switch(req.body.toSlot) {
        case 1: 
          toValue = currentHand.slot1;
          break;
        case 2: 
          toValue = currentHand.slot2;
          break;
        case 3: 
          toValue = currentHand.slot3;
          break;
        case 4: 
          toValue = currentHand.slot4;
          break;
        case 5: 
          toValue = currentHand.slot5;
          break;
        case 6: 
          toValue = currentHand.slot6;
          break;
        case 7: 
          toValue = currentHand.slot7;
          break;
      }
    }
    else if(req.body.toCell) {
      const fieldCell = await FieldCells.findOne({
        where: {
          id: req.body.toCell
        }
      });
      toValue = fieldCell?.symbol_id;
    }
    
    switch(req.body.slot) {
      case 1: 
        await currentHand.update({
          slot1: toValue
        });
        break;
      case 2: 
        await currentHand.update({
          slot2: toValue
        });
        break;
      case 3: 
        await currentHand.update({
          slot3: toValue
        });
        break;
      case 4: 
        await currentHand.update({
          slot4: toValue
        });
        break;
      case 5: 
        await currentHand.update({
          slot5: toValue
        });
        break;
      case 6: 
        await currentHand.update({
          slot6: toValue
        });
        break;
      case 7: 
        await currentHand.update({
          slot7: toValue
        });
        break;
    }
    
    status = 200;
  }
  catch(err) {
    
    status = 422;
  }
  finally {
    res.status(status);
    res.json({});
  }
});

app.post('/api/insertSymbolInHand', async (req, res) => {
  let status = 400;
  try {
    if(!req.session.game)
      throw true;

    const currentPlayer = await Players.findOne({
      where: {
        lobby_id: req.session.lobby.id,
        slot: findSlotByTurn(req.session.game.turn, req.session.lobby.max_players)
      },
    });
    if(!currentPlayer)
      throw true;

    const currentHand = await Hands.findOne({
      where: {
        player_id: currentPlayer.id
      }
    })

    if(!currentHand)
      throw true;
    
    switch(req.body.slot) {
      case 1: 
        await currentHand.update({
          slot1: req.body.symbolId
        });
        break;
      case 2: 
        await currentHand.update({
          slot2: req.body.symbolId
        });
        break;
      case 3: 
        await currentHand.update({
          slot3: req.body.symbolId
        });
        break;
      case 4: 
        await currentHand.update({
          slot4: req.body.symbolId
        });
        break;
      case 5: 
        await currentHand.update({
          slot5: req.body.symbolId
        });
        break;
      case 6: 
        await currentHand.update({
          slot6: req.body.symbolId
        });
        break;
      case 7: 
        await currentHand.update({
          slot7: req.body.symbolId
        });
        break;
    }
    
    status = 200;
  }
  catch(err) {
    
    status = 422;
  }
  finally {
    res.status(status);
    res.json({});
  }
});

app.post('/api/insertSymbolInSet', async (req, res) => {
  let status = 400;
  try {
    if(!req.session.game)
      throw true;
    
    const symbol = await Symbols.findOne({
      where: {
        id: req.body.symbolId
      }
    });

    if(!symbol)
      throw true;

    const fieldCell = await FieldCells.findOne({
      where: {
        symbol_id: req.body.symbolId
      }
    });

    if(fieldCell) {
      await fieldCell.update({
        symbol_id: null
      })
    }
    else {
      const currentHand = await Hands.findOne({
        where: {
          [Op.or]: [
            {slot1: req.body.symbolId},
            {slot2: req.body.symbolId},
            {slot3: req.body.symbolId},
            {slot4: req.body.symbolId},
            {slot5: req.body.symbolId},
            {slot6: req.body.symbolId},
            {slot7: req.body.symbolId}
          ]
        }
      });
  
      if(currentHand) {
        if(currentHand.slot1 === req.body.symbolId)
          await currentHand.update({
            slot1: null
          })
        else if(currentHand.slot2 === req.body.symbolId)
          await currentHand.update({
            slot2: null
          })
        else if(currentHand.slot3 === req.body.symbolId)
          await currentHand.update({
            slot3: null
          })
        else if(currentHand.slot4 === req.body.symbolId)
          await currentHand.update({
            slot4: null
          })
        else if(currentHand.slot5 === req.body.symbolId)
          await currentHand.update({
            slot5: null
          })
        else if(currentHand.slot6 === req.body.symbolId)
          await currentHand.update({
            slot6: null
          })
        else if(currentHand.slot7 === req.body.symbolId)
          await currentHand.update({
            slot7: null
          })
      }
    }
    
    symbol.update({
      in_box: true
    })
    
    status = 200;
  }
  catch(err) {
    console.log(err);
    status = 422;
  }
  finally {
    res.status(status);
    res.json({});
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

app.get('/api/logout', async (req, res) => {
  let status = 200;
  store.destroy(req.sessionID, function () {
    req.session.destroy(() => {
      res.redirect('http://localhost:3001')
    });
  });
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
      if (!req.session.user) 
        req.session.user = user[0]
    }
    else {
      status = 422;
    }
  }
  catch(err) {
    
    status = 422;
  }
  finally {
    res.status(status)
    res.json({});
  }
});

app.post('/api/addFriend', async (req, res) => {
  let status = 400;
  try {
    const user = await Users.findOne({
      where: {
        login: req.body.login,
      }
    });
    const friend = await Users.findOne({
      where: {
        login: req.body.friend,
      }
    });
    if(user && friend) {
      const friendBackDb = await Friends.findOne({
        where: {
          user_id: friend.id,
          friend_id: user.id
        }
      });
      const friendDb = await Friends.findOrCreate({
        where: {
          user_id: user.id,
          friend_id: friend.id
        },
        defaults: {
          user_id: user.id,
          friend_id: friend.id
        }
      });

      if(friendBackDb) {
        await friendDb[0].update({
          is_accepted: true
        });
        await friendBackDb.update({
          is_accepted: true
        });
      }
      status = 200;
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

app.post('/api/removeFriend', async (req, res) => {
  let status = 400;
  try {
    const user = await Users.findOne({
      where: {
        login: req.body.login,
      }
    });
    const friend = await Users.findOne({
      where: {
        login: req.body.friend,
      }
    });
    if(user && friend) {
      const friendBackDb = await Friends.findOne({
        where: {
          user_id: friend.id,
          friend_id: user.id
        }
      });
      const friendDb = await Friends.findOne({
        where: {
          user_id: user.id,
          friend_id: friend.id
        }
      });
      await friendDb?.destroy();
      await friendBackDb?.destroy();
      status = 200;
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

app.post('/api/findAllFriends', async (req, res) => {
  let status = 400;
  let friends : Users[] = [];
  try {
    const user = await Users.findOne({
      where: {
        login: req.body.login
      }
    });
    if(user) {
      friends = await Users.findAll({
        attributes: ['login'],
        where: {
          id: user.id
        },
        include: {
          model: Users,
          attributes: ['login'],
          as: 'friend',
          required: true,
          through: {
            where: {
              is_accepted: true
            }
          }
        }
      });
      status = 200;
    } 
    else
      status = 422;
  }
  catch(err) {
    
    status = 422;
  }
  finally {
    res.status(status);
    res.json(friends);
  }
});

const httpServer = createServer(app);

// socket options
const io = new Server(httpServer, { 
  cors: {
      origin: "http://localhost:3001"
  }
});

io.on("connection", (socket) => {
  // Lobby
  socket.on('room', async (room: string) => {
    if(room){
      socket.join(room);
      socket.broadcast.to(room).emit('newUser', room);
    }
    console.log('get room');
  });
  socket.on('removeRoom', async (room: string) => {
    if(room){
      socket.broadcast.to(room).emit('removedFromLobby');
      io.in(room).socketsLeave(room);
    }
  });
  socket.on('leaveRoom', (room: string) => {
    socket.leave(room);
  })
  socket.on('removeFromRoom', async (user_id: number) => {
    const user = await Users.findOne({
      where: {
        id: user_id
      }
    })
    if(user?.socket_id)
      socket.broadcast.to(user.socket_id).emit('removedFromLobby');
  });

  // Game
  socket.on('startGame', (room: string) => {
    socket.broadcast.to(room).emit('startGame');
  })
  socket.on('nextTurn', (room: string) => {
    socket.broadcast.to(room).emit('nextTurn');
  })
  socket.on('gameMove', (room: string | undefined) => {
    if(room)
      io.in(room).emit('gameMove');
  })

  // Friends
  socket.on('addFriend', async (login: string, friendName: string) => {
    const user = await Users.findOne({
      where: {
        login: friendName
      }
    })
    if(user?.socket_id)
      socket.broadcast.to(user.socket_id).emit('friendInvite', login);
  });
  socket.on('friendAdded', async (login: string, friendName: string) => {
    const user = await Users.findOne({
      where: {
        login: friendName
      }
    })
    if(user?.socket_id){
      io.to(user.socket_id).emit('friendAdded');
      io.to(socket.id).emit('friendAdded');
    }
  });
  socket.on('removeFriend', async (login: string, friendName: string) => {
    const user = await Users.findOne({
      where: {
        login: friendName
      }
    })
    if(user?.socket_id)
      socket.broadcast.to(user.socket_id).emit('removeFriend');
  });
  socket.on('inviteInLobby', async (friendName: string, invite_id: string) => {
    const user = await Users.findOne({
      where: {
        login: friendName
      }
    })
    console.log('invite')
    if(user?.socket_id)
      socket.broadcast.to(user.socket_id).emit('inviteInLobby', invite_id);
  });

  // Login
  socket.on('login', async (login: string, socket_id: string) => {
    const user = await Users.findOne({
      where: {
        login: login
      }
    })
    await user?.update({
      socket_id: socket_id
    })
    // socket.broadcast.to(room).emit('newUser', room);
  });
});

httpServer.listen(3000);