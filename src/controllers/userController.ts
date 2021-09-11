import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { getMongoManager, getMongoRepository, getRepository } from "typeorm";
import { User, UserInfo } from "../entity/mySql/User";
import { Tweet } from "../entity/mongoDB/Tweet";
import * as passport from "passport";
import * as bcrypt from "bcrypt";
import routes from "../../routes";
import * as fs from "fs";
import { LowerTweet, LowerTweetInfo } from "../entity/mongoDB/LowerTweet";

const getMongoTweet = async () => {
  const tweetsRepository = getMongoRepository(Tweet);
  const tweets = await tweetsRepository.find();
  // console.log(tweets);
  return tweets;
};

export const getHome = async (req: Request, res: Response) => {
  try {
    console.log("uploads 폴더 확인중...");
    fs.readdirSync("uploads");
    console.log("uploads 폴더 확인 완료");
  } catch (error) {
    console.error("upload 폴더가 없어서 uploads 폴더를 만듭니다.");
    fs.mkdirSync("uploads");
  }
  try {
    fs.readdirSync("uploads/tweet");
  } catch (error) {
    console.error("tweet 폴더가 없어서 tweet 폴더를 만듭니다.");
    fs.mkdirSync("uploads/tweet");
  }
  try {
    fs.readdirSync("uploads/tweet/image");
  } catch (error) {
    console.error("image 폴더가 없어서 image 폴더를 만듭니다.");
    fs.mkdirSync("uploads/tweet/image");
  }
  try {
    fs.readdirSync("uploads/tweet/video");
  } catch (error) {
    console.error("video 폴더가 없어서 video 폴더를 만듭니다.");
    fs.mkdirSync("uploads/tweet/video");
  }

  const tweets = await getMongoTweet();
  console.log(res.locals.loggedUser);
  return res.render("home", {
    tweets,
    //  user: res.locals.user,
    pageTitle: "Home",
  });
};
export const getJoin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.render("join");
};

export const postJoin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, password2 } = req.body;
    if (password !== password2) {
      return res.status(404).render("join", {
        errorMessage: "패스워드가 맞지않습니다.",
      });
    }
    const UserRepository = getMongoRepository(User);
    const useremailExists = await UserRepository.findOne({ email });
    if (useremailExists) {
      return res.status(404).render("join", {
        errorMessage: "Tis username is already taken.",
      });
    }
    console.log(email, password);
    const exUser = new User();
    exUser.email = email;
    const hash = await bcrypt.hash(password, 7);
    exUser.password = hash;
    await getMongoManager().save(exUser);
    console.log("성공");
    return res.redirect("/login");
  } catch (error) {
    console.error("LocalJoinController Error : ", error);
  }
};

export const getLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.render("login");
};

export const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      const message = `PssportLogin Error 1 :  ${error}`;
      return res.render("error", { error: message });
    }
    if (!user) {
      console.log(user, info);
      const message = `PssportLogin Error user :  ${error}`;
      return res.render("error", { error: message });
    }
    return req.login(user, (error) => {
      if (error) {
        const message = `PssportLogin Error 2 :  ${error}`;
        return res.render("error", { error: message });
      }
      res.redirect(routes.home);
    });
  })(req, res, next);
};

export const getTweet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.render("createTweet");
};

export const postTweet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 실제 유저db 때 사용
    // const exUser: User<UserInfo> = await getMongoRepository(User).findOne({
    //   where: { id: req.user.id },
    // });
    // if (!exUser) {
    //   const message = `postPost Error: User Not Found`;
    //   res.render("error", { error: message });
    // }

    // 저장
    const tweet = new Tweet();
    tweet.userId = res.locals.user.id;
    tweet.content = req.body.content;
    tweet.file = req.file ? req.file.path : null;
    if (tweet.file) {
      const pathNames = req.file.mimetype.split("/");
      const pathName = pathNames[0];

      if (pathName === "image") {
        tweet.media = "image";
      } else if (pathName === "video") {
        tweet.media = "video";
      }
    } else {
      tweet.media = "default";
    }
    await getMongoManager().save(tweet);
    // user정보 업데이트
    const userTweet = { tweetId: tweet.id.toString() };
    res.locals.user.tweet.push(userTweet);
    res.locals.user.tweetCount += 1;

    const tweets = await getMongoTweet();
    // res.render("home", { tweets, user: res.locals.user, pageTitle: "Home" });
    res.redirect(routes.home);
  } catch (error) {
    const message = "postTweet Error: ?";
    console.error("postTweet Error: " + error);
    res.status(404).render("error", { error: message });
  }
};
