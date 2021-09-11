import "reflect-metadata";
import * as express from "express";
import * as morgan from "morgan";
import * as passport from "passport";
import * as expressSession from "express-session";
import * as cookieParser from "cookie-parser";
import * as pug from "pug";

import {
  createConnection,
  createConnections,
  getConnection,
  getConnectionManager,
  getManager,
  getMongoManager,
  getMongoRepository,
  getRepository,
} from "typeorm";
import { User } from "./entity/mySql/User";
import { Tweet } from "./entity/mongoDB/Tweet";
import userRouter from "./routers/userRouter";
import { passportConfig } from "./passport/index";
import { localMiddleware } from "./middleware";

import routes from "../routes";
import postRouter from "./routers/postRouter";
import "dotenv/config";
import { TweetInfo } from "./entity/mySql/TweetInfo";
import { Like } from "./entity/mongoDB/Like";
import { UserLike } from "./entity/mySql/UserLike";
import apiRouter from "./routers/apiRouter";
import { LowerTweet } from "./entity/mongoDB/LowerTweet";
import { join } from "path";

const PORT = process.env.PORT || 4000;

const app: express.Application = express();
passportConfig();

createConnection({
  type: "mongodb",
  host: "localhost",
  port: 27017,
  database: "project",
  useUnifiedTopology: true,
  useNewUrlParser: true,
  entities: [Tweet, Like, LowerTweet, User, TweetInfo, UserLike],
  synchronize: true,
})
  .then(async () => {
    app.use(morgan("dev"));
    app.set("view engine", "pug");
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use(
      expressSession({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: true,
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(localMiddleware);
    app.use("/uploads", express.static("uploads"));
    app.use("/assets", express.static("assets"));

    app.use(userRouter);
    app.use(routes.tweet, postRouter);
    app.use(routes.api, apiRouter);

    app.listen(process.env.PORT, () => {
      console.log(`${process.env.PORT}번 포트 연결 완료`);
    });
  })
  .catch((error) => {
    console.log(`Express Disconnected ${error}`);
  });
