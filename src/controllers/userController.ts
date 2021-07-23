import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { getMongoManager, getMongoRepository, getRepository } from "typeorm";
import { User, UserInfo } from "../entity/mySql/User";
import { Tweet } from "../entity/mongoDB/Tweet";
import * as passport from "passport";
import * as bcrypt from "bcrypt";
import routes from "../../routes";
import * as fs from "fs";

const getMongoTweet = async () => {
  const tweetsRepository = getMongoRepository(Tweet);
  const tweets = await tweetsRepository.find();
  console.log(tweets);
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

  const tweets = await getMongoTweet();
  return res.render("home", {
    tweets,
    user: res.locals.user,
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
  const { email, password } = req.body;
  try {
    const exUser = await getRepository(User).findOne({
      where: { email },
    });
    console.log(exUser);
    if (exUser) {
      res.render("home");
    }
    const hash = await bcrypt.hash(password, 12);
    await getRepository(User).save(
      getRepository(User).create({
        email,
        password: hash,
      })
    );
    console.log("성공");
    return res.redirect("home");
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
    // const exUser: User<UserInfo> = await getRepository(User).findOne({
    //   where: { id: req.user.id },
    // });
    // if (!exUser) {
    //   const message = `postPost Error: User Not Found`;
    //   res.render("error", { error: message });
    // }

    // 저장

    console.log(req.file);
    const tweet = new Tweet();
    tweet.userId = res.locals.user.id;
    tweet.content = req.body.content;
    tweet.file = req.file ? req.file.path : null;
    await getMongoManager().save(tweet);

    // user정보 업데이트
    const userTweet = { tweetId: tweet.id.toString() };
    res.locals.user.tweet.push(userTweet);
    res.locals.user.tweetCount += 1;
    console.log(res.locals.user.tweetCount);

    const tweets = await getMongoTweet();
    // res.render("home", { tweets, user: res.locals.user, pageTitle: "Home" });
    res.redirect(routes.home);
  } catch (error) {
    console.error("postTweet Error: ?");
    const message = "postTweet Error: ?";
    res.render("error", { error: message });
  }
};

// export const postMongoTest = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const mongo = new Tweet();
//     console.log(req.body.content);
//     mongo.firstName = req.body.content;
//     mongo.firstName = req.body.content;
//     const manager = getMongoManager();
//     await manager.save(mongo);
//     console.log(
//       await getMongoRepository(Tweet).find({ firstName: req.body.content })
//     );
//     console.log("----------------");
//     const db1 = await manager.find(Tweet, {});
//     console.log(db1);
//     console.log("----------------");
//     const db2 = await manager.find(Tweet, { firstName: req.body.content });
//     console.log(db2);
//     res.redirect(routes.home);
//   } catch (error) {
//     console.log("Error", error);
//     res.redirect(routes.error);
//   }
// };
