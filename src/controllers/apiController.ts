import { Console } from "console";
import { NextFunction, Request, Response } from "express";
import { stringify } from "querystring";
import { getMongoManager, getMongoRepository, ObjectID } from "typeorm";
import { Like, LikeInfo } from "../entity/mongoDB/Like";
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

    // User id로 정보 변경해야함
    like.userId = res.locals.user.id;

    await getMongoManager().save(like);
    await tweetRepository.findOneAndUpdate(
      { _id: ObjectId(tweetId) },
      { $inc: { likeNumber: 1 }, $push: { Likes: [like] } },
      { upsert: true }
    );
    console.log(tweet);
    console.log("좋아요 업데이트 완료");

    // User 에 Like 정보 업데이트
  } catch (error) {
    console.log("error : " + error);
  } finally {
    res.end();
  }
};
