import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { getMongoManager, getMongoRepository, getRepository } from "typeorm";
import { User, UserInfo } from "../entity/mySql/User";
import * as passport from "passport";
import * as bcrypt from "bcrypt";
import routes from "../../routes";
import { Tweet } from "../entity/mongoDB/Tweet";

export const getHome = async (req: Request, res: Response) => {
  return res.render("home", { user: res.locals.user, pageTitle: "Home" });
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

    const tweet = new Tweet();
    tweet.userId = res.locals.user.id;
    tweet.content = req.body.content;
    await getMongoManager().save(tweet);
    const userTweet = { tweetId: tweet.id.toString() };
    res.locals.user.tweet.push(userTweet);
    res.render("home", { user: res.locals.user, pageTitle: "Home" });
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
