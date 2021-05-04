import express from 'express';
import {watch, getEdit, getUpload,postUpload, deleteVideo, postEdit} from '../controllers/videoController';
import {videoMulterMiddeleware, privateMiddleware} from '../middlewares';

const videoRouter = express.Router();

videoRouter.route("/upload").all(privateMiddleware).get(getUpload).post(videoMulterMiddeleware.fields([{name:"video"}, {name:"thumbnail"}]),postUpload);
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(privateMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(privateMiddleware).get(deleteVideo);

export default videoRouter;