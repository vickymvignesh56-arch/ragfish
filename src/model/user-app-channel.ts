import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

import { User } from "./user.js";
import { App } from "./app.js";
import { Channel } from "./channel.js";
import { UserAppChannelResource } from "./user-app-channel-resource.js";

@Entity("user_app_channels")
export class UserAppChannel {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "uuid",
  })
  userId!: string;

  @Column({
    type: "uuid",
  })
  appId!: string;

  @Column({
    type: "uuid",
  })
  channelId!: string;

  @ManyToOne(() => User, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "userId",
  })
  user!: User;

  @ManyToOne(() => App, (app) => app.userAppChannels, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "appId",
  })
  app!: App;

  @ManyToOne(() => Channel, (channel) => channel.userAppChannels, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "channelId",
  })
  channel!: Channel;

  @OneToMany(() => UserAppChannelResource, (mapping) => mapping.userAppChannel)
  resources!: UserAppChannelResource[];

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt!: Date;
}
