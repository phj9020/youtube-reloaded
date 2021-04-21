import express from 'express';
import {postEdit, getEdit, profile,getChangePassword,postChangePassword, logout, startGithubLogin,finishGithubLogin} from '../controllers/userController';
import {privateMiddleware, publicOnlyMiddleware, avatarMulterMiddleware} from '../middlewares';

const userRouter = express.Router();

userRouter.get("/logout", privateMiddleware, logout);
userRouter.route("/edit").all(privateMiddleware).get(getEdit).post(avatarMulterMiddleware.single('avatar'), postEdit);
userRouter.route("/change-password").all(privateMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/:id([0-9a-f]{24})",privateMiddleware, profile);
userRouter.get("/github/start",publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish",publicOnlyMiddleware, finishGithubLogin);

export default userRouter;