import { type } from "node:os";
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";

interface TweetInfo {
  id?: ObjectID;
  userId: string;
  content: string;
  file?: string;
  createAt?: Date;
  updateAt?: Date;
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
  content: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updateAt: Date;
}
