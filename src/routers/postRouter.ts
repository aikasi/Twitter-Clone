import * as express from "express";
import { isLoggedIn, uploadTweet } from "../middleware";
import routes from "../../routes";
import { getTweet, postTweet } from "../controllers/userController";
import {
  getPostHome,
  getTweetDetail,
  postDeleteTweet,
  getDeleteTweet,
} from "../controllers/tweetController";

const postRouter: express.Router = express.Router();

postRouter.get(routes.home, getPostHome);

postRouter.get(routes.tweetCreate, getTweet);
postRouter.post(routes.tweetCreate, uploadTweet, postTweet);

postRouter.get(routes.tweetDetail(), getTweetDetail);

postRouter.get(routes.tweetDelete(), getDeleteTweet);
postRouter.post(routes.tweetDelete(), postDeleteTweet);
export default postRouter;
