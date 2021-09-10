import * as express from "express";
import { isLoggedIn, uploadTweet } from "../middleware";
import routes from "../../routes";
import {
  PostTweetLike,
  PostTweetLikeCancel,
} from "../controllers/apiController";

const apiRouter: express.Router = express.Router();

apiRouter.post(routes.tweetLike(), PostTweetLike);
apiRouter.post(routes.tweetLikeCancel(), PostTweetLikeCancel);

export default apiRouter;
