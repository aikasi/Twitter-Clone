import { NextFunction, Request, Response } from "express";
import { getMongoRepository, getRepository } from "typeorm";
import routes from "../../routes";
import { Tweet } from "../entity/mongoDB/Tweet";
import { User, UserInfo } from "../entity/mySql/User";
import { localMiddleware } from "../middleware";

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
    console.log(id);
    const tweetsRepository = getMongoRepository(Tweet);
    await tweetsRepository.findOneAndDelete({ userId: res.locals.user.id });
    return res.redirect(routes.home);
  } catch (error) {
    console.error("ERROR : " + error);
  }

  return res.render("deleteTweet");
};
