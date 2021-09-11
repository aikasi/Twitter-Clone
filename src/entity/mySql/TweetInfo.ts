import {
  Column,
  Entity,
  ManyToOne,
  ObjectID,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User, UserInfo } from "../mySql/User";

export interface Info {
  id: number;
  tweetId: string;
  user: User<UserInfo>;
}

@Entity()
export class TweetInfo<Info> {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  tweetId: string;

  @ManyToOne(() => User, (user) => user.tweets)
  user: User<UserInfo>;
}
