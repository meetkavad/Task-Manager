import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import taskRouter from "./router/taskRouter";
import connectDB from "./db/connect";

dotenv.config();
const app:Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", taskRouter);

const port = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL || "");
    app.listen(port, () => console.log(`server is listening at port ${port}`));
  } catch (error) {
    console.error(error);
  }
};

start();




