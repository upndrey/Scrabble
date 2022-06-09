import express from "express";
import * as friendsController from '../controllers/friendsController';

export const friendsRouter = express.Router();

friendsRouter.post('/addFriend', friendsController.addFriend);
friendsRouter.post('/removeFriend', friendsController.removeFriend);
friendsRouter.post('/findAllFriends', friendsController.findAllFriends);

