import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { UserAppChannel } from "./user-app-channel.js";
import { ChannelResource } from "./channel-resource.js";

@Entity("user_app_channel_resources")
export class UserAppChannelResource {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "uuid",
  })
  userAppChannelId!: string;

  @Column({
    type: "uuid",
  })
  channelResourceId!: string;

  @ManyToOne(
    () => UserAppChannel,
    (userAppChannel) => userAppChannel.resources,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({
    name: "userAppChannelId",
  })
  userAppChannel!: UserAppChannel;

  @ManyToOne(
    () => ChannelResource,
    (channelResource) => channelResource.userAppChannelResources,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({
    name: "channelResourceId",
  })
  channelResource!: ChannelResource;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt!: Date;
}
