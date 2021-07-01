import "reflect-metadata";
import * as express from "express";
import * as morgan from "morgan";
import * as passport from "passport";
import * as expressSession from "express-session";
import * as cookieParser from "cookie-parser";
import pug from "pug";

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
import { User as Tweet } from "./entity/User";

import "dotenv/config";
import userRouter from "./routers/userRouter";
import { passportConfig } from "./passport/index";
import { localMiddleware } from "./middleware";
import routes from "../routes";
import postRouter from "./routers/postRouter";
import { join } from "path";

const PORT = process.env.PORT || 4000;

const app: express.Application = express();
passportConfig();

createConnections([
  {
    name: "default",
    type: "mongodb",
    host: "localhost",
    port: 27017,
    database: "project",
    useUnifiedTopology: true,
    useNewUrlParser: true,
    entities: [Tweet],
    synchronize: true,
  },
  {
    name: "mySQL",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.ORM_CONFIG_ID,
    password: process.env.ORM_CONFIG_PASSWORD,
    database: process.env.ORM_CONFIG_DBNAME,
    entities: [User],
    synchronize: true,
    logging: process.env.NODE_ENV === "production" ? true : false,
  },
])
  .then((connection) => {
    const mysqlDB = getConnection("mySQL");

    mysqlDB.getRepository(User);

    console.log("MySql Database Connection!");
  })
  .then((connection) => {
    const mongoDB = getConnection("default");

    mongoDB.getMongoRepository(Tweet);
    console.log("MongoDB Database Connection!");
  })
  .catch((error) => console.log(`Database Disconnected ${error}`))

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

    app.use(userRouter);
    app.use(routes.posts, postRouter);

    app.listen(4001, () => {
      console.log("4000번 포트 연결 완료");
    });
  })
  .catch((error) => {
    console.log(`Express Disconnected ${error}`);
  });
