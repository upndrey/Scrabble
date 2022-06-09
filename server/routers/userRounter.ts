import express from "express";
import * as userController from '../controllers/userController';

export const userRouter = express.Router();

userRouter.post('/login', userController.login);
userRouter.post('/logout', userController.logout);
userRouter.post('/signup', userController.signup);
userRouter.post('/getUserData', userController.getUserData);