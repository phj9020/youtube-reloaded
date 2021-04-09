import express from 'express';
import morgan from 'morgan';

const PORT= 3000;

const app = express();

const logger = morgan("dev");
//middleware 
app.use(logger);

//Global Router
const globalRouter = express.Router();

const handleHome = (req, res) => {
    res.send("Home")
}

globalRouter.get("/", handleHome);

//User Router
const userRouter = express.Router();

const handleUser = (req, res) => {
    res.send("edit-user")
}

userRouter.get("/edit", handleUser);

//Video Router
const videoRouter = express.Router();

const handleWatchVideo = (req, res) => {
    res.send("watch-video")
}

videoRouter.get("/watch", handleWatchVideo);

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);


app.listen(PORT, () => console.log(`Server is running on port:${PORT} ✌️`));
