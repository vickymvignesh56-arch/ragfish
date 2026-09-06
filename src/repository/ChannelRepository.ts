import { AppDataSource } from "../config/database.js";
import { Channel, type ChannelType } from "../model/channel.js";

export type CreateChannelRequest = {
  name: string;
  description: string;
  channelType: ChannelType;
};

export type UpdateChannelRequest = {
  name?: string;
  description?: string;
};
export class ChannelRepository {
  private repository;
  constructor() {
    this.repository = AppDataSource.getRepository(Channel);
  }

  findById(id: string): Promise<Channel | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByUserId(userId: string): Promise<Channel[]> {
    return this.repository.find({ where: { userId } });
  }

  findChannelIdByUserId(userId: string, id: string): Promise<Channel | null> {
    return this.repository.findOne({ where: { userId, id } });
  }

  findNameByUserId(userId: string, name: string): Promise<Channel | null> {
    return this.repository.findOne({ where: { userId, name } });
  }

  create(user: CreateChannelRequest, userId: string): Promise<Channel> {
    const newUser = this.repository.create({
      name: user.name,
      description: user.description,
      channelType: user.channelType,
      userId,
    });
    return this.repository.save(newUser);
  }

  async update(id: string, updateData: UpdateChannelRequest) {
    const channel = await this.findById(id);
    if (!channel) {
      return null;
    }
    Object.assign(channel, updateData);
    return await this.repository.save(channel);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.repository.delete({ id, userId });
    return (result.affected ?? 0) > 0;
  }
}
export const channelRepository = new ChannelRepository();
