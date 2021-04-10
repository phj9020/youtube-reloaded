import express from 'express';
import morgan from 'morgan';
import globalRouter from './routers/globalRouter';
import videoRouter from './routers/videoRouter';
import userRouter from './routers/userRouter';

const PORT= 3000;

const app = express();

const logger = morgan("dev");
//middleware 
app.use(logger);

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);


app.listen(PORT, () => console.log(`Server is running on port:${PORT} ✌️`));
