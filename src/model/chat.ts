import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./user.js";
import { App } from "./app.js";
import { ChatMessage } from "./chat.message.js";
import { ChannelResource } from "./channel-resource.js";

@Entity("chats")
export class Chat {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid")
  userId!: string;

  @Column("uuid")
  appId!: string;

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
    type: "uuid",
  })
  resourceId!: string;

  @ManyToOne(() => ChannelResource, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "resourceId",
  })
  resource!: ChannelResource;

  @Column({
    type: "boolean",
    nullable: true,
  })
  isPinned!: boolean;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  pinnedAt!: Date | null;

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

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt!: Date;
}
