import { User as UserModel, UserInfo } from "../../src/entity/mySql/User";

declare global {
  namespace Express {
    interface User extends UserModel<UserInfo> {}
  }
}
