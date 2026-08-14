import "reflect-metadata";
import { DataSource } from "typeorm";
import { dbConfig } from "../env.js";
import { ChannelResource } from "../model/channel-resource.js";
import { Channel } from "../model/channel.js";
import { Chat } from "../model/chat.js";
import { App } from "../model/app.js";
import { User } from "../model/user.js";
import { ChatMessage } from "../model/chat.message.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  synchronize: true,
  logging: true,
  entities: [User, App, Channel, ChannelResource, Chat, ChatMessage],
});
