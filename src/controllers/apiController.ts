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

    await tweetRepository.findOneAndUpdate(
      { _id: ObjectId(tweetId) },

      {
        $inc: { likeNumber: -1 },
        $unset: { likes: res.locals.loggedInUser.id },
      },
      { upsert: true }
    );

    const userRepository = getMongoRepository(User);

    await userRepository.findOneAndUpdate(
      { _id: ObjectId(res.locals.loggedInUser.id) },
      { $inc: { likeCount: -1 }, $unset: { likes: tweetId } }
    );

    // await userRepository.findOneAndDelete(
    //   { id: ObjectId(res.locals.loggedInUser.id) },{
    //     ${}
    //   }
    // );
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
    tweets.userId = res.locals.user.id;
    tweets.content = req.body.content;
    tweets.reply = id;
    tweets.file = req.file ? req.file.path : null;
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
    const userTweet = { tweetId: tweets.id.toString() };
    res.locals.user.tweet.push(userTweet);
    res.locals.user.tweetCount += 1;

    const tweetRepository = getMongoRepository(Tweet);
    const [tweet] = await tweetRepository.findByIds([ObjectId(id)]);

    // tweet 에 like -> User id로 정보 변경해야함
    const like = {
      lowerId: tweets.id,
      userId: res.locals.user.id,
    };
    // like.lowerId = ObjectId(tweets.id).toString();
    // like.userId = res.locals.user.id;

    await tweetRepository.findOneAndUpdate(
      { _id: ObjectId(tweet.id) },
      { $push: { lowerTweet: like } }
    );
    console.log(tweet);

    // 유저 정보 업뎃
    // User 에 Like 정보 업데이트
    console.log(
      res.locals.user.likes.push({ id: tweet.id, userId: tweet.userId })
    );
    res.locals.user.likes.push({ id: tweet.id, userId: tweet.userId });
    console.log("유저 정보 : ");
    console.log(res.locals.user);
  } catch (error) {
    console.log("error : " + error);
  } finally {
    res.redirect(routes.home);
  }
};
