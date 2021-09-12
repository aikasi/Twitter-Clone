import * as express from "express";
import {
  getJoin,
  getLogin,
  getHome,
  postJoin,
  postLogin,
  getLogout,
  getProfileEdit,
  postProfileEdit,
  getUserProfile,
  postUserProfile,
  postUserFollowCancel,
} from "../controllers/userController";
import routes from "../../routes";
import { uploadAvatar } from "../middleware";

const userRouter: express.Router = express.Router();

userRouter.get(routes.home, getHome);

userRouter.get(routes.join, getJoin);
userRouter.post(routes.join, postJoin);

userRouter.get(routes.login, getLogin);
userRouter.post(routes.login, postLogin);

userRouter.get(routes.logout, getLogout);

userRouter.get("/profile/edit", getProfileEdit);
userRouter.post("/profile/edit", uploadAvatar, postProfileEdit);

userRouter.get("/profile/:id", getUserProfile);
userRouter.post("/profile/:id", postUserProfile);

userRouter.post("/profile/:id/cancel", postUserFollowCancel);

export default userRouter;
