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
import { App } from "./app.js";
import { ChannelResource } from "./channel-resource.js";

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
  description!: string;

  @Column({
    type: "varchar",
  })
  channelType!: ChannelType;

  @Column({
    type: "boolean",
    default: true,
  })
  status!: boolean;

  @ManyToOne(() => App, (app) => app.channels, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "appId" })
  app!: App;

  @OneToMany(() => ChannelResource, (resource) => resource.channel)
  resources!: ChannelResource[];

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt!: Date;
}
