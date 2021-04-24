import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { User, UserInfo } from "../models/mySql/User";

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
