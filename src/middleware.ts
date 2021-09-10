import { NextFunction, Request, Response } from "express";
import routes from "../routes";
import * as multer from "multer";
import * as fs from "fs";
import * as path from "path";

export const isLoggedIn = (req: Request, res: Response, next) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

export const isNotLoggedIn = (req: Request, res: Response, next) => {
  console.log(req.isAuthenticated());
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(201).send("로그인한 상태");
  }
};

const multerTweet = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      const fileNames = file.mimetype.split("/");
      const fileName = fileNames[0];
      console.log(file);
      if (fileName === "video") {
        cb(null, "uploads/tweet/video");
      } else if (fileName === "image") {
        cb(null, "uploads/tweet/image");
      }
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
});

const multerTweetVideo = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/tweet/video");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
});

export const uploadTweet = multerTweet.single("tweetFile");
// export const uploadTweetVideo = multerTweetVideo.single("tweetFile");

export const localMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.siteName = "Project1";
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;

  res.locals.user = {
    id: 1,
    email: "test@naver.com",
    password: "test123",
    nick: "firstTestAccount",
    tweet: [{ tweetId: "1" }, { tweetId: "2" }, { tweetId: "3" }],
    tweetCount: 3,
  };
  res.locals.userTwo = {
    id: 2,
    email: "test1@naver.com",
    password: "test123",
    nick: "secondTestAccount",
    tweet: [
      { tweetId: "4" },
      { tweetId: "5" },
      { tweetId: "6" },
      { tweetId: "7" },
    ],
    tweetCount: 4,
  };

  next();
};
