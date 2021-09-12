import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { getMongoManager, getMongoRepository, getRepository } from "typeorm";
import { User, UserInfo, Login } from "../entity/mySql/User";
import { Tweet } from "../entity/mongoDB/Tweet";
import * as passport from "passport";
import * as bcrypt from "bcrypt";
import routes from "../../routes";
import * as fs from "fs";
import * as session from "express-session";

const ObjectId = require("mongodb").ObjectId;

const getMongoTweet = async () => {
  const tweetsRepository = getMongoRepository(Tweet);
  const tweets = await tweetsRepository.find();
  return tweets;
};

declare module "express-session" {
  interface Session {
    user: any;
    loogedIn: boolean;
  }
}

declare module "express" {
  interface Request {
    body: any;
    files: any;
  }
}

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
  const userRepository = getMongoRepository(User);
  if (res.locals.loggedIn) {
    const user = await userRepository.findOne(res.locals.loggedInUser.id);
    console.log(tweets);
    console.log(user);
    return res.render("home", {
      tweets,
      user,
      pageTitle: "Home",
    });
  }

  return res.render("home", {
    tweets,
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
    exUser.role = Login.LOCAL;
    exUser.tweets = [];
    exUser.tweetCount = 0;
    exUser.likeCount = 0;
    exUser.likes = [];
    exUser.nick = "";
    exUser.firstName = "";
    exUser.lastName = "";
    exUser.age = 0;
    exUser.profilePhoto = "uploads/defaultProfile.png";
    exUser.selfIntroduction = "";
    exUser.follow = [];
    exUser.followNumber = 0;
    exUser.follwing = [];
    exUser.follwingNumber = 0;
    exUser.mainTweet = "";
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
  try {
    const {
      body: { email, password },
    } = req;
    const UserRepository = getMongoRepository(User);
    const user = await UserRepository.findOne({ email, role: Login.LOCAL });
    if (!user) {
      return res.status(400).render("login", {
        errorMessage: "email을 가진 유저가 존재하지 않습니다.",
      });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).render("login", {
        errorMessage: "잘못된 비밀번호입니다.",
      });
    }
    req.session.loogedIn = true;
    req.session.user = user;
    console.log("로그인 성공");
    return res.redirect("/");
  } catch (error) {
    console.error("ERROR : " + error);
  }
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
    if (res.locals.loggedIn) {
      // 저장
      const tweet = new Tweet();
      tweet.userId = res.locals.loggedInUser.id;
      tweet.content = req.body.content;
      tweet.file = req.file ? req.file.path : null;
      tweet.likeNumber = 0;
      tweet.lowerTweetNumber = 0;
      tweet.lowerTweetNumber = 0;
      tweet.likes = [];
      tweet.lowerTweets = [];
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

      const userRepository = getMongoRepository(User);
      await userRepository.findOneAndUpdate(
        { _id: ObjectId(res.locals.loggedInUser.id) },
        { $inc: { tweetCount: 1 }, $push: { tweets: tweet.id } },
        { upsert: true }
      );

      res.redirect(routes.home);
    }
  } catch (error) {
    const message = "postTweet Error: ?";
    console.error("postTweet Error: " + error);
    res.status(404).render("error", { error: message });
  }
};

export const getLogout = (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy(() => req.session);
  res.redirect("/");
};

export const getProfileEdit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.render("uesrProfileEdit");
};

export const postProfileEdit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { firstName, lastName, nickName, age, selfIntroduction },
    } = req;
    const {
      files: { headerFile, profileFile },
    } = req;
    const firstNameDB = firstName ? firstName : "";
    const lastNameDB = lastName ? lastName : "";
    const nickNameDB = nickName ? nickName : "";
    const ageDB = age ? age : "";
    const selfIntroductionDB = selfIntroduction ? selfIntroduction : "";

    const header = headerFile[0] ? headerFile[0] : "";
    const profile = profileFile[0] ? profileFile[0] : "";

    const userRepository = getMongoRepository(User);
    await userRepository.findOneAndUpdate(
      { _id: ObjectId(res.locals.loggedInUser.id) },
      {
        $set: {
          firstName: firstNameDB,
          lastName: lastNameDB,
          nick: nickNameDB,
          age: ageDB,
          selfIntroduction: selfIntroductionDB,
          headerPhoto: header.path ? header.path : "",
          profilePhoto: profile.path ? profile.path : "",
        },
      },
      { upsert: true }
    );

    return res.redirect("/");
  } catch (error) {
    console.log("ERROR : " + error);
  }
};
export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id },
  } = req;
  const userRepository = getMongoRepository(User);
  const user = await userRepository.findOne(id);
  console.log(user);
  res.render("userProfile", { user, id });
};

export const postUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id },
  } = req;
  const userRepository = getMongoRepository(User);
  const myUserDB = await userRepository.findOne(
    ObjectId(res.locals.loggedInUser.id)
  );
  const myUser = Object.assign(myUserDB);

  const profileUserDB = await userRepository.findOne(ObjectId(id));
  const profileUser = Object.assign(profileUserDB);

  // 팔로우
  await userRepository.findOneAndUpdate(
    { _id: ObjectId(res.locals.loggedInUser.id) },
    {
      $inc: { followNumber: 1 },
      $push: { follow: id },
    },
    { upsert: true }
  );

  // 팔로워
  await userRepository.findOneAndUpdate(
    { _id: ObjectId(id) },
    {
      $inc: { follwingNumber: 1 },
      $push: { follwing: res.locals.loggedInUser.id },
    }
  );
  return res.redirect(`/profile/${id}`);
};

export const postUserFollowCancel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id },
  } = req;
  const userRepository = getMongoRepository(User);
  const myUserDB = await userRepository.findOne(
    ObjectId(res.locals.loggedInUser.id)
  );
  const myUser = Object.assign(myUserDB);

  const profileUserDB = await userRepository.findOne(ObjectId(id));
  const profileUser = Object.assign(profileUserDB);

  // 팔로우 login 유저
  const userDB = await userRepository.findOne(ObjectId(myUser.id));
  const userFollowList = userDB.follow.filter(
    (target) => target !== profileUser
  );
  await userRepository.findOneAndUpdate(
    { _id: ObjectId(res.locals.loggedInUser.id) },
    {
      $inc: { followNumber: -1 },
      $set: { follow: userFollowList },
    },
    { upsert: true }
  );

  // 팔로워 profile 유저
  const profileUserRepository = await userRepository.findOne(
    ObjectId(profileUser.id)
  );
  const profileUserFollowList = profileUserRepository.follow.filter(
    (target) => target !== myUser.id
  );

  await userRepository.findOneAndUpdate(
    { _id: ObjectId(id) },
    {
      $inc: { follwingNumber: -1 },
      $push: { follwing: profileUserFollowList },
    }
  );

  return res.redirect(`/profile/${id}`);
};
