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

export interface TweetInfo {
  id?: ObjectID;
  userId: string;
  content: string;
  file?: string;
  createAt?: Date;
  updateAt?: Date;
  media?: string;
  reply?: string;
  lowerTweet?: string[];
  lowerTweetNumber?: number;
  likeNumber?: number;
  likes?: string[];
  firstName: string;
  lastName: string;
  tweetUserAvata: string;
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

  @Column()
  likes: string[];

  // 댓글기능
  @Column({ nullable: true })
  reply: string;

  @Column()
  lowerTweetNumber: number;

  @Column()
  lowerTweets: string[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createAt: Date;

  @Column()
  firstName: string;
  @Column()
  lastName: string;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updateAt: Date;

  @Column({ nullable: true })
  tweetUserAvata: any;
}
