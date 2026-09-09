import { AppDataSource } from "../config/database.js";
import { UserAppChannel } from "../model/user-app-channel.js";

export class AppChannelRepository {
  private repository;
  constructor() {
    this.repository = AppDataSource.getRepository(UserAppChannel);
  }

  findById(id: string): Promise<UserAppChannel | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByAppId(appId: string): Promise<UserAppChannel[]> {
    return this.repository.find({ where: { appId } });
  }

  findByAppIdAndChannelId(
    appId: string,
    channelId: string,
  ): Promise<UserAppChannel | null> {
    return this.repository.findOne({ where: { appId, channelId } });
  }

  findAppIdAndChannelId(
    appId: string,
    channelId: string,
    id: string,
  ): Promise<UserAppChannel[]> {
    return this.repository.find({ where: { id, appId, channelId } });
  }

  findByIdAndAppId(appId: string, id: string): Promise<UserAppChannel[]> {
    return this.repository.find({ where: { appId, id } });
  }

  findOneByIdAndAppId(
    appId: string,
    id: string,
  ): Promise<UserAppChannel | null> {
    return this.repository.findOne({
      where: { appId, id },
      relations: { channel: true },
    });
  }

  async create(channelId: string, appId: string): Promise<UserAppChannel> {
    const existing = await this.repository.findOne({
      where: {
        appId,
        channelId,
      },
    });

    if (existing) {
      return existing;
    }
    const appChannel = {
      appId,
      channelId,
    };
    return await this.repository.save(appChannel);
  }
}

export const appChannelRepository = new AppChannelRepository();
