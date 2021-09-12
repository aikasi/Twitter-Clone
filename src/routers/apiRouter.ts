import * as express from "express";
import { uploadTweet } from "../middleware";
import routes from "../../routes";
import {
  getReply,
  // postDeleteTweet,
  postReply,
  PostTweetLike,
  PostTweetLikeCancel,
} from "../controllers/apiController";

const apiRouter: express.Router = express.Router();

apiRouter.post(routes.tweetLike(), PostTweetLike);
apiRouter.post(routes.tweetLikeCancel(), PostTweetLikeCancel);

apiRouter.get(routes.tweetReply(), getReply);
apiRouter.post(routes.tweetReply(), uploadTweet, postReply);
export default apiRouter;
