import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { App } from "./app.js";
import { Chat } from "./chat.js";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "varchar",
  })
  name!: string;

  @Column({
    type: "varchar",
    unique: true,
  })
  email!: string;

  @Column({
    type: "varchar",
  })
  password!: string;

  @Column({
    type: "boolean",
    default: true,
  })
  isActive!: boolean;

  @OneToMany(() => App, (app) => app.user)
  apps!: App[];

  @OneToMany(() => Chat, (chat) => chat.user)
  chats!: Chat[];

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt!: Date;
}
