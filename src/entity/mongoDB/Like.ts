import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

interface LikeInfo {
  id?: ObjectID;
  userId: string;
}

@Entity()
export class Like<LikeInfo> {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  userId: string;
}
