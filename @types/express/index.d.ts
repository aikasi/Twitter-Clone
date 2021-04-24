import { User as UserModel, UserInfo } from "../../src/models/mySql/User";

declare global {
  namespace Express {
    interface User extends UserModel<UserInfo> {}
  }
}
