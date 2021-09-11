const HOME = "/";
const ERROR = "/error";

// 회원
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";

// 트윗
const TWEET = "/tweet";
const TWEET_CREATE = "/create";
const TWEET_REPLY = "/:id/reply";
const TWEET_DETAIL = "/:id";
const TWEET_EDIT = "/:id/edit";

// like
const API = "/api";
const TWEET_LIKE = "/:id/like";
const TWEET_LIKE_CANCEL = "/:id/like/cancel";
const TWEET_DELETE = "/:id/delete";

// User
const PROFILE = "/profile";
const Edit = "/edit";

const routes = {
  home: HOME,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  error: ERROR,
  tweet: TWEET,
  api: API,
  tweetCreate: TWEET_CREATE,
  tweetReply: (id?) => {
    if (id) {
      return `${API}/${id}/reply`;
    } else {
      return TWEET_REPLY;
    }
  },
  // pugReplyHome: `${TWEET}${TWEET_CREATE}`,
  tweetDetail: (id?) => {
    if (id) {
      return `${TWEET}/${id}`;
    } else {
      return TWEET_DETAIL;
    }
  },
  tweetEdit: (id) => {
    if (id) {
      return `${TWEET}/${id}/edit`;
    } else {
      return TWEET_EDIT;
    }
  },
  tweetDelete: (id?) => {
    if (id) {
      return `${TWEET}/${id}/delete`;
    } else {
      return TWEET_DELETE;
    }
  },
  tweetLike: (id?) => {
    if (id) {
      return `${API}/${id}/like`;
    } else {
      return TWEET_LIKE;
    }
  },
  tweetLikeCancel: (id?) => {
    if (id) {
      return `${API}/${id}/cancel`;
    } else {
      return TWEET_LIKE_CANCEL;
    }
  },
};

export default routes;
