import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  Column,
} from "typeorm";

import { User } from "./user.js";
import { App } from "./app.js";
import { ChatMessage } from "./chat.message.js";

@Entity("chats")
export class Chat {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.chats, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({
    type: "varchar",
    nullable: true,
  })
  title!: string;

  @Column({
    type: "boolean",
    nullable: true,
  })
  isPinned!: string;

  @Column({
    type: "varchar",
    nullable: true,
  })
  isPinnedAt!: string;

  @ManyToOne(() => App, (app) => app.chats, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "appId" })
  app!: App;

  @OneToMany(() => ChatMessage, (message) => message.chat, {
    cascade: true,
  })
  messages!: ChatMessage[];

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;
}
