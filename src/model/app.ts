import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./user.js";
import { Channel } from "./channel.js";
import { Chat } from "./chat.js";

@Entity("apps")
export class App {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "varchar",
  })
  name!: string;

  @Column({
    type: "varchar",
    nullable: true,
  })
  description!: string;

  @Column({
    type: "boolean",
    default: true,
  })
  status!: boolean;

  @ManyToOne(() => User, (user) => user.apps, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: User;

  @OneToMany(() => Channel, (channel) => channel.app)
  channels!: Channel[];

  @OneToMany(() => Chat, (chat) => chat.app)
  chats!: Chat[];

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt!: Date;

  @Column({
    type: "boolean",
    default: false,
  })
  isPinned!: boolean;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  pinnedAt?: Date;
}
