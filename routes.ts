const HOME = "/";
const ERROR = "/error";

// 회원
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";

// 트윗
const TWEET = "/tweet";
const TWEET_CREATE = "/create";
const TWEET_DETAIL = "/:id";
const TWEET_EDIT = "/:id/edit";
const TWEET_DELETE = "/:id/delete";

const routes = {
  home: HOME,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  error: ERROR,
  tweet: TWEET,
  tweetCreate: TWEET_CREATE,
  tweetDetail: (id: any) => {
    if (id) {
      return `${TWEET}/${id}`;
    }
    return TWEET_DETAIL;
  },
  tweetEdit: (id: any) => {
    if (id) {
      return `${TWEET}/${id}/edit`;
    }
    return TWEET_EDIT;
  },
  tweetDelete: (id: any) => {
    if (id) {
      return `${TWEET}/${id}/delete`;
    }
    return TWEET_DELETE;
  },
};

export default routes;
