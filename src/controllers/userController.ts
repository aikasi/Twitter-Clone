import { NextFunction, Request, Response } from "express";
import {
  EntityRepository,
  getConnection,
  getRepository,
  Repository,
} from "typeorm";
import { User, UserInfo } from "../models/mySql/User";
import * as passport from "passport";
import * as bcrypt from "bcrypt";
import routes from "../../routes";
import { stringify } from "node:querystring";
import { Post } from "../models/mySql/Post";

export const getHome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.render("home");
};

export const getJoin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.render("join");
};

export const postJoin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const exUser = await getRepository(User).findOne({
      where: { email },
    });
    console.log(exUser);
    if (exUser) {
      res.render("home");
    }
    const hash = await bcrypt.hash(password, 12);
    await getRepository(User).save(
      getRepository(User).create({
        email,
        password: hash,
      })
    );
    console.log("성공");
    return res.redirect("home");
  } catch (error) {
    console.error("LocalJoinController Error : ", error);
  }
};

export const getLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.render("login");
};

export const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      const message = `PssportLogin Error 1 :  ${error}`;
      return res.render("error", { error: message });
    }
    if (!user) {
      console.log(user, info);
      const message = `PssportLogin Error user :  ${error}`;
      return res.render("error", { error: message });
    }
    return req.login(user, (error) => {
      if (error) {
        const message = `PssportLogin Error 2 :  ${error}`;
        return res.render("error", { error: message });
      }
      res.redirect(routes.posts);
    });
  })(req, res, next);
};

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.render("createpost");
};

export const postPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const exUser: User<UserInfo> = await getRepository(User).findOne({
      where: { id: req.user.id },
    });
    if (!exUser) {
      const message = `postPost Error: User Not Found`;
      res.render("error", { error: message });
    }
    const post = await getRepository(Post).save(
      getRepository(Post).create({
        name: req.body.title,
        user: exUser,
      })
    );
    res.redirect(routes.postDetail(exUser.id));
  } catch (error) {
    console.error("postPost Error: ?");
    const message = "postPost Error: ?";
    res.render("error", { error: message });
  }
};
