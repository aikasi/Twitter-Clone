import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PostContent } from "../mongoDB/PostContent";
import { User, UserInfo } from "./User";

export enum PostRole {
  POST = "POST",
  CHAT = "CHAT",
  AUCTION = "AUCTION",
  ORERPOST = "ORDERPOST",
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "enum", enum: PostRole, default: PostRole.POST })
  role: PostRole;

  @CreateDateColumn()
  createDate: string;

  @UpdateDateColumn()
  updateDate: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User<UserInfo>;

  @OneToOne(() => PostContent, (content) => content.post)
  content: PostContent;
}
