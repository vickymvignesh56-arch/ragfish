import type { Channel } from "../model/channel.js";
import {
  channelRepository,
  ChannelRepository,
  type CreateChannelRequest,
  type UpdateChannelRequest,
} from "../repository/ChannelRepository.js";

export class ChannelService {
  constructor(private readonly channelRepository: ChannelRepository) {}

  async create(
    userId: string,
    channelData: CreateChannelRequest,
  ): Promise<any> {
    const existingChannel = await this.channelRepository.findNameByUserId(
      userId,
      channelData.name,
    );
    if (existingChannel) {
      throw new Error("Channel with this name already exists");
    }
    return this.channelRepository.create({ ...channelData }, userId);
  }

  find(userId: string): Promise<any[]> {
    return this.channelRepository.findByUserId(userId);
  }

  findOne(userId: string, id: string): Promise<any | null> {
    return this.channelRepository.findChannelIdByUserId(userId, id);
  }

  findBychannelIdAndUserId(
    userId: string,
    channelId: string,
  ): Promise<Channel | null> {
    return this.channelRepository.findChannelIdByUserId(userId, channelId);
  }

  async delete(userId: string, id: string): Promise<boolean> {
    return this.channelRepository.delete(id, userId);
  }

  async update(
    userId: string,
    id: string,
    updateData: UpdateChannelRequest,
  ): Promise<Channel | null> {
    const channel = await this.channelRepository.findChannelIdByUserId(
      userId,
      id,
    );
    if (!channel) {
      throw new Error("Channel not found");
    }
    if (updateData.name) {
      const existingChannel = await this.channelRepository.findNameByUserId(
        userId,
        updateData.name,
      );
      if (existingChannel && existingChannel.id !== id) {
        throw new Error("Channel with this name already exists");
      }
    }
    return await this.channelRepository.update(id, updateData);
  }
}

export const channelService = new ChannelService(channelRepository);
