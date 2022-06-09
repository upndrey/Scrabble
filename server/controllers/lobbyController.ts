import * as express from 'express'; 
import { CLIENT_ADDR, saltRounds } from '../options';
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import { Hands, Lobbies, Players } from '../db/models';

export const createLobby = async (req: express.Request, res: express.Response) => {
  let status = 500;
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
    status = 500;
  }
  finally {
    res.status(status);
    res.json({
      invite_id: inviteId
    });
  }
}

export const closeLobby = async (req: express.Request, res: express.Response) => {
  let status = 500;
  try{
    const lobby = await Lobbies.findOne({
      where: {
        invite_id: req.body.invite_id
      }
    });
    if(!lobby) 
      throw true;
    
      
    const players = await Players.findAll({
      where: {
        lobby_id: req.session.lobby.id
      }
    });
    if(!players) 
      throw true;

    await lobby.destroy();
    players.forEach(async (player) => {
      await player.destroy();
    })

    req.session.lobby = null!;
    req.session.player = null!;
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

export const getInvite = async (req: express.Request, res: express.Response) => {
  let status = 500;
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
    status = 500;
  }
  finally {
    res.status(status);
    res.redirect(CLIENT_ADDR + '/lobby?' + req.params.id);
  }
}

export const removeFromLobby = async (req: express.Request, res: express.Response) => {
  let status = 500;
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
    status = 500;
  }
  finally {
    res.status(status);
    res.json({});
  }
}

export const removeLobbyData = async (req: express.Request, res: express.Response) => {
  let status = 500;
  try {
    req.session.lobby = null!;
    req.session.player = null!;
  }
  catch(err) {
    status = 500;
  }
  finally {
    res.status(status);
    res.json({});
  }
}
