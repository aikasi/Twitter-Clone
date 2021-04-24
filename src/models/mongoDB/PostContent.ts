import {
  Column,
  Entity,
  JoinColumn,
  ObjectID,
  ObjectIdColumn,
  OneToOne,
} from "typeorm";
import { Post } from "../mySql/Post";

@Entity()
export class PostContent {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  content: string;

  @OneToOne(() => Post, (post) => post.content)
  post: Post;
}
