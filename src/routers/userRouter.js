import express from 'express';
import {postEdit, getEdit, remove, profile, logout, startGithubLogin,finishGithubLogin} from '../controllers/userController';
import {privateMiddleware, publicOnlyMiddleware} from '../middlewares';

const userRouter = express.Router();

userRouter.get("/logout", privateMiddleware, logout);
userRouter.route("/edit").all(privateMiddleware).get(getEdit).post(postEdit);
userRouter.get("/remove", remove);
userRouter.get("/:id", profile);
userRouter.get("/github/start",publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish",publicOnlyMiddleware, finishGithubLogin);

export default userRouter;