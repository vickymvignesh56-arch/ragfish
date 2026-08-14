import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

import { Chat } from "./chat.js";

@Entity("chat_messages")
export class ChatMessage {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Chat, (chat) => chat.messages, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "chatId" })
  chat!: Chat;

  @Column({
    type: "text",
  })
  message!: string;

  @Column({
    type: "text",
  })
  answer!: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;
}
