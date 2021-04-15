import { NextFunction, Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { User } from "../src/entities/User";

export const home = async (req: Request, res: Response, next: NextFunction) => {
  return res.send(getRepository(User).find());
};
