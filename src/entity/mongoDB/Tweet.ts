import { type } from "os";
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";
import { Like, LikeInfo } from "./Like";

interface TweetInfo {
  id?: ObjectID;
  userId: string;
  content: string;
  file?: string;
  createAt?: Date;
  updateAt?: Date;
  media?: string;
  reply?: string;
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

  @Column(() => Like)
  Likes: Like<LikeInfo>[];

  // 댓글기능
  @Column({ nullable: true })
  reply: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updateAt: Date;
}
