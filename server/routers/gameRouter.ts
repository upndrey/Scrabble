import express from "express";
import * as gameController from '../controllers/gameController';

export const gameRouter = express.Router();

gameRouter.post('/startGame', gameController.startGame);
gameRouter.post('/nextTurn', gameController.nextTurn);
gameRouter.post('/noMoreWays', gameController.noMoreWays);
gameRouter.post('/exitGame', gameController.exitGame);
gameRouter.post('/removeSymbolInField', gameController.removeSymbolInField);
gameRouter.post('/insertSymbolInField', gameController.insertSymbolInField);
gameRouter.post('/removeSymbolInHand', gameController.removeSymbolInHand);
gameRouter.post('/insertSymbolInHand', gameController.insertSymbolInHand);
gameRouter.post('/insertSymbolInSet', gameController.insertSymbolInSet);

