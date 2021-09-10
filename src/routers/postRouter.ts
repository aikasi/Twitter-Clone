import * as express from "express";
import { isLoggedIn, uploadTweet } from "../middleware";
import routes from "../../routes";
import { getTweet, postTweet } from "../controllers/userController";
import { getPostHome, getTweetDetail } from "../controllers/tweetController";

const postRouter: express.Router = express.Router();

postRouter.get(routes.home, getPostHome);

postRouter.get(routes.tweetCreate, getTweet);
postRouter.post(routes.tweetCreate, uploadTweet, postTweet);

postRouter.get(routes.tweetDetail(), getTweetDetail);

export default postRouter;
