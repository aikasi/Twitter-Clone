import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

interface TweetInfo {
  id?: ObjectID;
  userId: string;
  content: string;
}

@Entity()
export class Tweet<TweetInfo> {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  userId: string;

  @Column()
  content: string;
}
