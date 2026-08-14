import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Channel } from "./channel.js";

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
    type: "boolean",
    default: true,
  })
  status!: boolean;

  @ManyToOne(() => Channel, (channel) => channel.resources, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "channelId" })
  channel!: Channel;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt!: Date;
}
