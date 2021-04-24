import * as passport from "passport";
import { getConnection, getRepository } from "typeorm";
import { User, UserInfo } from "../models/mySql/User";
import { local } from "./local";

export const passportConfig = () => {
  passport.serializeUser((user: UserInfo, done) => {
    console.log("ser");
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log("des");
    getRepository(User)
      .findOne({ where: { id } })
      .then((user) => done(null, user))
      .catch((error) => done(error));
  });
  local();
};
