import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo'
import rootRouter from './routers/rootRouter';
import videoRouter from './routers/videoRouter';
import userRouter from './routers/userRouter';
import {localsMiddleware} from './middlewares';

const app = express();

const logger = morgan("dev");

app.set("views", process.cwd()+ "/src/views");
app.set('view engine', 'pug');


//middleware 
app.use(logger);
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: "hello",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/youtube'
    })
}))
app.use(localsMiddleware);

//router
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);


export default app;


