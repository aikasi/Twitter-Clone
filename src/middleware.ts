import { NextFunction, Request, Response } from "express";
import routes from "../routes";

export const isLoggedIn = (req: Request, res: Response, next) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

export const isNotLoggedIn = (req: Request, res: Response, next) => {
  console.log(req.isAuthenticated());
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(201).send("로그인한 상태");
  }
};

export const localMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.siteName = "Project1";
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;

  res.locals.user = {
    id: 1,
    email: "test@naver.com",
    password: "test123",
    nick: "firstTestAccount",
    tweet: [{ id: "60dd68dee369499b4c3da09f" }],
  };
  next();
};
