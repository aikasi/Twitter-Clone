import {
  Column,
  Entity,
  ManyToOne,
  ObjectID,
  ObjectIdColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User, UserInfo } from "./User";

export interface UserLikeInfo {
  id: number;
  tweetId: string;
  user: User<UserInfo>;
}

@Entity()
export class UserLike<UserLikeInfo> {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  tweetId: string;

  @ManyToOne(() => User, (user) => user.likes)
  user: User<UserInfo>;
}
