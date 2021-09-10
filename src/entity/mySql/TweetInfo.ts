import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User, UserInfo } from "./User";

export interface Info {
  id: number;
  tweetId: string;
  user: User<UserInfo>;
}

@Entity()
export class TweetInfo<Info> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tweetId: string;

  @ManyToOne(() => User, (user) => user.tweet)
  user: User<UserInfo>;
}
