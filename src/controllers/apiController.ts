import { NextFunction, Request, Response } from "express";
import { stringify } from "querystring";
import { getMongoManager, getMongoRepository, ObjectID } from "typeorm";
import routes from "../../routes";
import { Tweet } from "../entity/mongoDB/Tweet";
import { User } from "../entity/mySql/User";
import "../middleware";
const ObjectId = require("mongodb").ObjectId;

export const getTweetLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(200);
};

export const PostTweetLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { tweetId, user },
  } = req;
  try {
    const tweetRepository = getMongoRepository(Tweet);
    const [tweet] = await tweetRepository.findByIds([ObjectId(tweetId)]);

    // tweet 에 like -> User id로 정보 변경해야함
    console.log("USERINFO : " + res.locals.loggedInUser.id);

    // await getMongoManager().save(like);
    const id = tweet.id.toString();
    await tweetRepository.findOneAndUpdate(
      { _id: ObjectId(tweetId) },

      {
        $inc: { likeNumber: 1 },
        $push: { likes: res.locals.loggedInUser.id },
      },
      { upsert: true }
    );

    const userRepository = getMongoRepository(User);
    await userRepository.findOneAndUpdate(
      { _id: ObjectId(res.locals.loggedInUser.id) },
      { $inc: { likeCount: 1 }, $push: { likes: tweetId } },
      { upsert: true }
    );
    // console.log(users);
    console.log("A");

    console.log("좋아요 업데이트 완료");
  } catch (error) {
    console.log("error : " + error);
    res.status(400).end();
  } finally {
    res.end();
  }
};

export const PostTweetLikeCancel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { tweetId, user },
  } = req;
  try {
    const tweetRepository = getMongoRepository(Tweet);
    const [tweet] = await tweetRepository.findByIds([ObjectId(tweetId)]);

    // Tweet
    const tweetDB = await tweetRepository.findOne(tweetId);
    const tweetLikeList = tweetDB.likes.filter(
      (target) => target !== res.locals.loggedInUser.id
    );
    await tweetRepository.findOneAndUpdate(
      { _id: ObjectId(tweetId) },

      {
        $inc: { likeNumber: -1 },
        $set: { likes: tweetLikeList },
      },
      { upsert: true }
    );

    // User
    const userRepository = getMongoRepository(User);
    const userDB = await userRepository.findOne(res.locals.loggedInUser.id);
    const userLikeList = userDB.likes.filter((target) => target !== tweetId);
    await userRepository.findOneAndUpdate(
      { _id: ObjectId(res.locals.loggedInUser.id) },
      { $inc: { likeCount: -1 }, $set: { likes: userLikeList } }
    );

    console.log("좋아요 업데이트 완료");

    // User 에 Like 정보 업데이트
  } catch (error) {
    console.log("error : " + error);
  } finally {
    res.end();
  }
};

export const postReply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id },
  } = req;
  try {
    const tweets = new Tweet();
    tweets.userId = res.locals.loggedInUser.id;
    tweets.content = req.body.content;
    tweets.reply = id;
    tweets.file = req.file ? req.file.path : null;
    tweets.likeNumber = 0;
    tweets.lowerTweetNumber = 0;
    tweets.likes = [];
    tweets.lowerTweets = [];
    if (tweets.file) {
      const pathNames = req.file.mimetype.split("/");
      const pathName = pathNames[0];

      if (pathName === "image") {
        tweets.media = "image";
      } else if (pathName === "video") {
        tweets.media = "video";
      }
    } else {
      tweets.media = "default";
    }
    await getMongoManager().save(tweets);
    // user정보 업데이트

    const tweetRepository = getMongoRepository(Tweet);
    const [tweet] = await tweetRepository.findByIds([ObjectId(id)]);

    // 상위 tweet에 정보 하위 tweet저장
    await tweetRepository.findOneAndUpdate(
      { _id: ObjectId(tweet.id) },
      {
        $inc: { lowerTweetNumber: +1 },
        $push: { lowerTweets: tweets.id },
      },
      { upsert: true }
    );

    // 유저 정보 업뎃
    const userRepository = getMongoRepository(User);
    await userRepository.findOneAndUpdate(
      { _id: ObjectId(res.locals.loggedInUser.id) },
      { $inc: { tweetCount: 1 }, $push: { tweets: tweets.id } },
      { upsert: true }
    );
  } catch (error) {
    console.log("error : " + error);
  } finally {
    res.redirect(routes.home);
  }
};
