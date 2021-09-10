import { Column, Entity, ManyToOne, ObjectID, ObjectIdColumn } from "typeorm";
import { Tweet, TweetInfo } from "./Tweet";

export interface LikeInfo {
  id?: ObjectID;
  userId: string;
  tweet?: Tweet<TweetInfo>;
}

@Entity()
export class Like<LikeInfo> {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  userId: string;

  @ManyToOne(() => Tweet, (tweet) => tweet.likes, { onDelete: "CASCADE" })
  tweet: Tweet<TweetInfo>;
}
