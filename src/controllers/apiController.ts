import { NextFunction, Request, Response } from "express";
import { stringify } from "querystring";
import { getMongoManager, getMongoRepository, ObjectID } from "typeorm";
import routes from "../../routes";
import { Like, LikeInfo } from "../entity/mongoDB/Like";
import { LowerTweet } from "../entity/mongoDB/LowerTweet";
import { Tweet } from "../entity/mongoDB/Tweet";
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
    body: { tweetId },
  } = req;
  try {
    const tweetRepository = getMongoRepository(Tweet);
    const [tweet] = await tweetRepository.findByIds([ObjectId(tweetId)]);
    // tweet.likeNumber = +1;
    // tweet.Likes = [(new Like<LikeInfo>().userId = res.locals.user.id)];
    // await getMongoManager().update(tweet)
    // await tweetRepository.findOneAndUp
    const like = new Like();

    // tweet 에 like -> User id로 정보 변경해야함
    like.userId = res.locals.user.id;
    await getMongoManager().save(like);

    await tweetRepository.findOneAndUpdate(
      { _id: ObjectId(tweetId) },
      { $inc: { likeNumber: 1 }, $push: { likes: like } },
      { upsert: true }
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
    console.log("좋아요 업데이트 완료");
  } catch (error) {
    console.log("error : " + error);
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
    body: { tweetId },
  } = req;
  try {
    const tweetRepository = getMongoRepository(Tweet);
    const [tweet] = await tweetRepository.findByIds([ObjectId(tweetId)]);

    const likeRepository = getMongoRepository(Like);
    const likes = await likeRepository.findOneAndDelete({
      userId: res.locals.user.id,
    });
    console.log(likes);
    await tweetRepository.findOneAndUpdate(
      { _id: ObjectId(tweetId) },
      {
        $inc: { likeNumber: -1 },
        $pull: { likes: { userId: res.locals.user.id } },
      },
      { upsert: true }
    );
    console.log(tweet);

    // User id로 정보 변경해야함
    // like.userId = res.locals.user.id;

    // await getMongoManager().save(like);
    // await tweetRepository.findOneAndDelete({ _id: ObjectId(tweetId) });

    console.log(tweet);
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
    // tweet.likeNumber = +1;
    // tweet.Likes = [(new Like<LikeInfo>().userId = res.locals.user.id)];
    // await getMongoManager().update(tweet)
    // await tweetRepository.findOneAndUp
    const like = new LowerTweet();

    // tweet 에 like -> User id로 정보 변경해야함
    like.lowerId = ObjectId(tweets.id).toString();
    like.userId = res.locals.user.id;
    await getMongoManager().save(like);

    await tweetRepository.findOneAndUpdate(
      { _id: ObjectId(tweet.id) },
      { $push: { lowerTweet: like } },
      { upsert: true }
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
