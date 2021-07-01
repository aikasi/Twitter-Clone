import { ObjectID } from "mongodb";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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
  tweet?: string;
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

  @Column({ nullable: true })
  tweet: string;

  @CreateDateColumn()
  newDate: string;

  @UpdateDateColumn()
  updateDate: string;
}
