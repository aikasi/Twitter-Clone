import { Column, Entity, ManyToOne, ObjectID, ObjectIdColumn } from "typeorm";
import { Tweet, TweetInfo } from "./Tweet";

export interface LowerTweetInfo {
  id?: ObjectID;
  userId: string;
  lowerId: string;
  tweet?: Tweet<TweetInfo>;
}

@Entity()
export class LowerTweet<LikeInfo> {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  lowerId: string;

  @Column()
  userId: string;

  @ManyToOne(() => Tweet, (tweet) => tweet.lowerTweet, { onDelete: "CASCADE" })
  tweet: Tweet<TweetInfo>;
}
