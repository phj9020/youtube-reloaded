import express from 'express';
import morgan from 'morgan';
import globalRouter from './routers/globalRouter';
import videoRouter from './routers/videoRouter';
import userRouter from './routers/userRouter';

const app = express();

const logger = morgan("dev");

app.set("views", process.cwd()+ "/src/views");
app.set('view engine', 'pug');


//middleware 
app.use(logger);
app.use(express.urlencoded({extended:true}))
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);


export default app;


