import {
  Column,
  Entity,
  ManyToOne,
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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tweetId: string;

  @ManyToOne(() => User, (user) => user.likes)
  user: User<UserInfo>;
}
