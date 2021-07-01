import * as express from "express";
import { isLoggedIn } from "../middleware";
import routes from "../../routes";
import { getPost, postPost } from "../controllers/userController";
import { getPostHome, getPostDetail } from "../controllers/postController";

const postRouter: express.Router = express.Router();

postRouter.get(routes.home, isLoggedIn, getPostHome);

postRouter.get(routes.postCreate, isLoggedIn, getPost);
postRouter.post(routes.postCreate, isLoggedIn, postPost);

postRouter.get("/:id", isLoggedIn, getPostDetail);

export default postRouter;
