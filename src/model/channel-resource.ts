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
import { Channel } from "./channel.js";
import { UserAppChannelResource } from "./user-app-channel-resource.js";

export type ChannelResourceType = "pdf" | "docx" | "xlxs";

export type ResourcesAdditionalInfo = {
  [key: string]: any;
};
export type UploadStatus = "completed" | "pending" | "failed" | "processing";

@Entity("channel_resources")
export class ChannelResource {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "varchar",
  })
  fileName!: string;

  @Column({
    type: "varchar",
  })
  filePath!: string;

  @Column({
    type: "bigint",
  })
  size!: number;

  @Column({
    type: "varchar",
  })
  fileType!: ChannelResourceType;

  @Column({
    type: "jsonb",
    nullable: true,
  })
  additionalInfo!: ResourcesAdditionalInfo | null;

  @Column({
    type: "varchar",
    default: "pending",
  })
  status!: UploadStatus;

  @Column({
    type: "uuid",
  })
  channelId!: string;

  @ManyToOne(() => Channel, (channel) => channel.resources, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "channelId",
  })
  channel!: Channel;

  @OneToMany(() => UserAppChannelResource, (mapping) => mapping.channelResource)
  userAppChannelResources!: UserAppChannelResource[];

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt!: Date;
}
