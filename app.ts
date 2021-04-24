import * as express from "express";
import * as morgan from "morgan";
import * as passport from "passport";
import * as expressSession from "express-session";
import * as cookieParser from "cookie-parser";
import pug from "pug";

import { createConnection, createConnections, getConnection } from "typeorm";
import { User } from "./src/models/mySql/User";
import { Post } from "./src/models/mySql/Post";

import "dotenv/config";
import userRouter from "./src/routers/userRouter";
import { passportConfig } from "./src/passport/index";
import { localMiddleware } from "./middleware";
import routes from "./routes";
import postRouter from "./src/routers/postRouter";
import { PostContent } from "./src/models/mongoDB/PostContent";

const PORT = process.env.PORT || 4000;

const app: express.Application = express();
passportConfig();

createConnections([
  {
    name: "mysqlDB",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.ORM_CONFIG_ID,
    password: process.env.ORM_CONFIG_PASSWORD,
    database: process.env.ORM_CONFIG_DBNAME,
    entities: [User, Post],
    synchronize: true,
    logging: process.env.NODE_ENV === "production" ? true : false,
  },
  {
    name: "mongoDB",
    type: "mongodb",
    host: "localhost",
    port: 27017,
    database: "project1",
    entities: [PostContent],
    synchronize: true,
    logging: process.env.NODE_ENV === "production" ? true : false,
  },
])
  .then((connection) => {
    const mysqlDB = getConnection("mysqlDB");

    mysqlDB.getRepository(User);
    mysqlDB.getRepository(Post);

    console.log("MySql Database Connection!");
  })
  .then((connection) => {
    const mongoDB = getConnection("mongoDB");

    mongoDB.getMongoRepository(PostContent);
    console.log("MongoDB Database Connection!");
  })
  .catch((error) => console.log(`Database Disconnected ${error}`))
  .then(() => {
    app.use(morgan("dev"));
    app.set("view engine", "pug");
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
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

    app.listen(4000, () => {
      console.log("4000번 포트 연결 완료");
    });
  })
  .catch((error) => {
    console.log(`Express Disconnected ${error}`);
  });
