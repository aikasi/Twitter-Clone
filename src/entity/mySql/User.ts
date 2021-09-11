import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  OneToMany,
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
  id?: ObjectID;
  email: string;
  password: string;
  nick?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  tweet?: string[];
  tweetCount?: number;
  profilePhoto?: string;
  headerPhoto?: string;
  selfIntroduction?: string;
  likes?: string[];
  likeCount?: number;
}

@Entity()
export class User<UserInfo> {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ type: "enum", default: Login.LOCAL })
  role: Login;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updateAt: Date;

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
  profilePhoto: string;

  @Column({ nullable: true })
  headerPhoto: string;

  @Column({ nullable: true })
  selfIntroduction: string;

  @Column()
  tweets: string[];

  @Column({ default: 0 })
  tweetCount: number;

  @Column()
  likes: string[];

  @Column({ default: 0 })
  likeCount: number;
}
