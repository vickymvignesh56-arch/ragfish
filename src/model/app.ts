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
import { Chat } from "./chat.js";
import { UserAppChannel } from "./user-app-channel.js";
import { LLMProvider } from "./LLMProvider.js";

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
  })
  systemPrompt!: string;

  @Column({
    type: "varchar",
    unique: true,
  })
  slug!: string;

  @Column({
    type: "varchar",
    nullable: true,
  })
  description!: string | null;

  @Column({
    type: "boolean",
    default: true,
  })
  status!: boolean;

  @Column({
    type: "boolean",
    default: false,
  })
  llmProvider!: boolean;

  @Column({
    type: "uuid",
  })
  userId!: string;

  @ManyToOne(() => User, (user) => user.apps, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "userId",
  })
  user!: User;

  @OneToMany(() => Chat, (chat) => chat.app)
  chats!: Chat[];

  @OneToMany(() => UserAppChannel, (userAppChannel) => userAppChannel.app)
  userAppChannels!: UserAppChannel[];

  @Column({
    type: "boolean",
    default: false,
  })
  isPinned!: boolean;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  pinnedAt!: Date | null;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt!: Date;

  @ManyToOne(() => LLMProvider, (llmProvider) => llmProvider.apps, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "llmProviderId" })
  llmProviders!: LLMProvider;
}
