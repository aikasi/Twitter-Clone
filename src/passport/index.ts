import * as passport from "passport";
import { getConnection, getMongoRepository, getRepository } from "typeorm";
import { User, UserInfo } from "../entity/mySql/User";
import { local } from "./local";

export const passportConfig = () => {
  passport.serializeUser((user: UserInfo, done) => {
    console.log("ser");
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log("des");
    getMongoRepository(User)
      .findOne(id)
      .then((user) => done(null, user))
      .catch((error) => done(error));
  });
  local();
};
