import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Chat } from "./chat.js";

@Entity("chat_messages")
export class ChatMessage {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "text",
  })
  chatId!: string;

  @ManyToOne(() => Chat, (chat) => chat.messages, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "chatId" })
  chat!: Chat;

  @Column({
    type: "text",
  })
  content!: string;

  @Column({
    type: "varchar",
  })
  role!: string;

  @Column({
    type: "text",
  })
  answer!: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt!: Date;
}
