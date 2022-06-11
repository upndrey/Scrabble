import express from "express";
import * as lobbyController from '../controllers/lobbyController';

export const lobbyRouter = express.Router();

lobbyRouter.post('/createLobby', lobbyController.createLobby);
lobbyRouter.post('/closeLobby', lobbyController.closeLobby);
lobbyRouter.get('/inviteLink/:id', lobbyController.getInvite);
lobbyRouter.post('/removeFromLobby', lobbyController.removeFromLobby);
lobbyRouter.post('/removeLobbyData', lobbyController.removeLobbyData);

