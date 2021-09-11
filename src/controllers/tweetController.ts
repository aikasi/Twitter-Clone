import { NextFunction, Request, Response } from "express";
import { getMongoRepository, getRepository } from "typeorm";
import routes from "../../routes";
import { Tweet } from "../entity/mongoDB/Tweet";
import { User, UserInfo } from "../entity/mySql/User";
import { localMiddleware } from "../middleware";
const ObjectId = require("mongodb").ObjectId;

export const getPostHome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const [exUser]: User<UserInfo>[] = await getRepository(User).find({
  //   where: { id: req.user.id },
  //   relations: ["posts"],
  // });
  // res.render("posts", { users: exUser });
};

export const getTweetDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id: tweetId },
  } = req;
  console.log(tweetId);
  const tweetsRepository = getMongoRepository(Tweet);
  const tweet = await tweetsRepository.findOne(tweetId);
  // console.log(tweet.file);
  return res.render("tweetDetail", { tweet });
};

export const postDeleteTweet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getDeleteTweet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      params: { id },
    } = req;
    const tweetsRepository = getMongoRepository(Tweet);
    // lowerTweet
    const tweetDB = await tweetsRepository.findOne(id);

    if (tweetDB.reply) {
      const replyTweet = tweetDB.reply;
      const tweetUser = tweetDB.id.toString();

      console.log("REPLY TWEET : " + replyTweet);
      const tweet = await tweetsRepository.findOne(replyTweet);
      const tweetLowerList = tweet.lowerTweets.filter(
        (target) => target !== replyTweet
      );
      await tweetsRepository.findOneAndUpdate(
        { _id: ObjectId(replyTweet) },

        {
          $inc: { lowerTweetNumber: -1 },
          $set: { lowerTweets: tweetLowerList },
        },
        { upsert: true }
      );

      // User
      const userRepository = getMongoRepository(User);
      const userDB = await userRepository.findOne(res.locals.loggedInUser.id);
      console.log(userDB);
      const userTweetList = userDB.tweets.filter(
        (target) => target !== tweetUser
      );

      await userRepository.findOneAndUpdate(
        { _id: ObjectId(res.locals.loggedInUser.id) },
        { $inc: { tweetCount: -1 }, $set: { tweets: userTweetList } },
        { upsert: true }
      );

      const isUserLike = userDB.likes.filter((target) => target == id);
      if (isUserLike) {
        const UserLikeList = userDB.likes.filter((target) => target !== id);
        await userRepository.findOneAndUpdate(
          { _id: ObjectId(res.locals.loggedInUser.id) },
          { $inc: { likeCount: -1 }, $set: { likes: UserLikeList } },
          { upsert: true }
        );
      }
    }
    console.log("삭제중");
    await tweetsRepository.findOneAndDelete({ _id: ObjectId(id) });

    return res.redirect(routes.home);
  } catch (error) {
    console.error("ERROR : " + error);
  }

  return res.render("deleteTweet");
};
