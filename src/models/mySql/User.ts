import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";

export enum Login {
  LOCAL = "LOCAL",
  KAKAO = "KAKAO",
  GITHUB = "GITHUB",
  GOOGLE = "GOOGLE",
}

export interface UserInfo {
  id: number;
  email: string;
  password: string;
  nick?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  posts: Post[];
}

@Entity()
export class User<UserInfo> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: Login, default: Login.LOCAL })
  role: Login;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  nick: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  age: number;

  @CreateDateColumn()
  newDate: string;

  @UpdateDateColumn()
  updateDate: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
