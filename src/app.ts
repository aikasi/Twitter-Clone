import * as express from "express";
import * as morgan from "morgan";
import expressSession from "express-session";
import cookieParser from "cookie-parser";
import pug from "pug";

import { createConnection } from "typeorm";
import { User } from "./entities/User";

import "dotenv/config";
import userRouter from "../routers/userRouter";

const PORT = process.env.PORT || 4000;

const app = express();

createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.ORM_CONFIG_ID,
  password: process.env.ORM_CONFIG_PASSWORD,
  database: process.env.ORM_CONFIG_DBNAME,
  entities: [User],
  synchronize: true,
  logging: process.env.NODE_ENV === "production" ? true : false,
})
  .then((connection) => {
    connection.getRepository(User);
    console.log("Database Connection!");
  })
  .catch((error) => console.log(`Database Disconnected ${error}`));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(userRouter);

app.listen(4000, () => {
  console.log("4000번 포트 연결 완료");
});
