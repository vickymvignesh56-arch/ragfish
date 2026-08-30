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
import { ChannelResource } from "./channel-resource.js";
import { UserAppChannel } from "./user-app-channel.js";

export type ChannelType = "files" | "database" | "xlxs";

@Entity("channels")
export class Channel {
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
  description!: string | null;

  @Column({
    type: "varchar",
  })
  channelType!: ChannelType;

  @Column({
    type: "boolean",
    default: true,
  })
  status!: boolean;

  @Column({
    type: "uuid",
  })
  userId!: string;

  @ManyToOne(() => User, (user) => user.channels, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "userId",
  })
  user!: User;

  @OneToMany(() => ChannelResource, (resource) => resource.channel)
  resources!: ChannelResource[];

  @OneToMany(() => UserAppChannel, (userAppChannel) => userAppChannel.channel)
  userAppChannels!: UserAppChannel[];

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt!: Date;
}
