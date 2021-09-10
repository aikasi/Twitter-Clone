import { type } from "os";
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { Like, LikeInfo } from "./Like";
import { LowerTweet, LowerTweetInfo } from "./LowerTweet";

export interface TweetInfo {
  id?: ObjectID;
  userId: string;
  content: string;
  file?: string;
  createAt?: Date;
  updateAt?: Date;
  media?: string;
  reply?: string;
  lowerTweet?: LowerTweet<LowerTweetInfo>[];
  likeNumber?: number;
  likes?: Like<LikeInfo>[];
}

@Entity()
export class Tweet<TweetInfo> {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  userId: string;

  @Column({ nullable: true })
  file: string;

  @Column()
  media: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  likeNumber: number;

  @OneToMany(() => Like, (like) => like.tweet, { cascade: true })
  likes: Like<LikeInfo>[];

  // 댓글기능
  @Column({ nullable: true })
  reply: string;

  @OneToMany(() => LowerTweet, (lowerTweet) => lowerTweet.tweet, {
    cascade: true,
  })
  lowerTweet: LowerTweet<LowerTweetInfo>[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updateAt: Date;
}
