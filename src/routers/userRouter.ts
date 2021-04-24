import * as express from "express";
import {
  getJoin,
  getLogin,
  getHome,
  postJoin,
  postLogin,
  getPost,
  postPost,
} from "../controllers/userController";
import routes from "../../routes";
import { isLoggedIn, isNotLoggedIn } from "../../middleware";

const userRouter: express.Router = express.Router();

userRouter.get(routes.home, getHome);

userRouter.get(routes.join, getJoin);
userRouter.post(routes.join, postJoin);

userRouter.get(routes.login, getLogin);
userRouter.post(routes.login, postLogin);

export default userRouter;
