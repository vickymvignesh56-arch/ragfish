import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from "typeorm";

import { User } from "./user.js";
import { App } from "./app.js";

export enum LLMProviderType {
  GEMINI = "GEMINI",
  OPENAI = "OPENAI",
}

@Entity("llm_providers")
@Index(["userId", "slug"], { unique: true })
export class LLMProvider {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.llmProviders, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({
    type: "enum",
    enum: LLMProviderType,
  })
  provider!: LLMProviderType;

  @Column({
    type: "varchar",
    length: 255,
  })
  slug!: string;

  @Column({ type: "text" })
  apiKey!: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  embeddingModel!: string;

  @Column({
    type: "varchar",
    length: 150,
  })
  chatModel!: string;

  @Column({
    type: "boolean",
    default: false,
  })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => App, (app) => app.llmProviders)
  apps!: App[];
}
