import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { User, UserInfo } from "../entity/mySql/User";
import { localMiddleware } from "../middleware";

export const getPostHome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [exUser]: User<UserInfo>[] = await getRepository(User).find({
    where: { id: req.user.id },
    relations: ["posts"],
  });
  res.render("posts", { users: exUser });
};

export const getTweetDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.send(req.user.id.toString());
};
