const HOME = "/";
const ERROR = "/error";

// 회원
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";

// 게시판
const POSTS = "/posts";
const POST_CREATE = "/create";
const POST_DETAIL = "/:id";
const POST_EDIT = "/:id/edit";
const POST_DELETE = "/:id/delete";

const routes = {
  home: HOME,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  error: ERROR,
  posts: POSTS,
  postCreate: POST_CREATE,
  postDetail: (id) => {
    if (id) {
      return `${POSTS}/${id}`;
    }
    return POST_DETAIL;
  },
  postEdit: (id) => {
    if (id) {
      return `${POSTS}/${id}/edit`;
    }
    return POST_EDIT;
  },
  postDelete: (id) => {
    if (id) {
      return `${POSTS}/${id}/delete`;
    }
    return POST_DELETE;
  },
};

export default routes;
