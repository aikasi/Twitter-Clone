import * as passport from "passport";
import * as LocalStrategy from "passport-local";
import * as bcrypt from "bcrypt";
import { User } from "../entity/mySql/User";
import { getMongoRepository, getRepository } from "typeorm";

export const local = () => {
  passport.use(
    new LocalStrategy.Strategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        console.log("local");
        try {
          const exUser = await getMongoRepository(User).findOne(email);
          console.log(exUser);
          if (exUser) {
            const result = await bcrypt.compare(
              password,
              (
                await exUser
              ).password
            );
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          console.error("Local Strategy : ", error);
          done(error);
        }
      }
    )
  );
};
