import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

interface TweetInfo {
  id?: ObjectID;
  userId: string;
  content: string;
  file?: string;
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
}
