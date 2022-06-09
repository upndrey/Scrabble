import * as express from 'express'; 
import bcrypt from 'bcrypt';
import { CLIENT_ADDR, saltRounds } from '../options';
import { store } from '../setup';
import { Fields, Games, Hands, Lobbies, Maps, Players, Sets, Users } from '../db/models';

export const login = async (req: express.Request, res: express.Response) => {
  let status = 500;
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
        status = 401;
    }
    else
      status = 401;
  }
  catch(err) {
    status = 500;
  }
  finally {
    res.status(status);
    res.json({});
  }
}

export const logout = async (req: express.Request, res: express.Response) => {
  let status = 500;
  try {
    store.destroy(req.sessionID, function () {
      req.session.destroy(() => {
        res.redirect(CLIENT_ADDR)
      });
    });
    status = 200;
  }
  catch(err) {
    status = 500;
  }
  finally {
    res.status(status);
    res.json({});
  }
}

export const signup = async (req: express.Request, res: express.Response) => {
  let status = 500;
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
      status = 401;
    }
  }
  catch(err) {
    status = 501;
  }
  finally {
    res.status(status)
    res.json({});
  }
}


export const getUserData = async (req: express.Request, res: express.Response) => {
  let status = 500;
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
      throw 500;
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
      throw 500;
      
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
      throw 500;
    game.symbols = symbols;
    req.session.game = gameBd;

    const {map, mapCells} = await Maps.generateMap();
    if(!map)
      throw 500;
    game.mapCells = mapCells;

    const {field, fieldCells} = await Fields.generateField(gameBd.id);
    if(!field)
      throw 500;
    game.fieldCells = fieldCells;

    status = 200;
  }
  catch(err) {
    if(err == 200)
      status = 200;
    else
      status = 500;
  }
  finally {
    res.status(status);
    res.json({login, lobby, game});
  }
}