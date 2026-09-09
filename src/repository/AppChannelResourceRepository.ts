import { AppDataSource } from "../config/database.js";
import { UserAppChannelResource } from "../model/user-app-channel-resource.js";

export class AppChannelResourceRepository {
  private repository;
  constructor() {
    this.repository = AppDataSource.getRepository(UserAppChannelResource);
  }

  findById(id: string): Promise<UserAppChannelResource | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByAppChannelIdAndResourceId(
    userAppChannelId: string,
    channelResourceId: string,
  ): Promise<UserAppChannelResource | null> {
    return await this.repository.findOne({
      where: {
        channelResourceId,
        userAppChannelId,
      },
      relations: {
        channelResource: true,
      },
    });
  }

  async findByIdAndResourceId(
    userAppChannelId: string,
    id: string,
  ): Promise<UserAppChannelResource | null> {
    return await this.repository.findOne({
      where: {
        id,
        userAppChannelId,
      },
    });
  }

  async create(
    userAppChannelId: string,
    channelResourceId: string,
  ): Promise<UserAppChannelResource | null> {
    const existing = await this.repository.findOne({
      where: {
        channelResourceId,
        userAppChannelId,
      },
    });
    if (existing) {
      return existing;
    }
    const appChannelResource = {
      userAppChannelId,
      channelResourceId,
    };
    return await this.repository.save(appChannelResource);
  }
}

export const appChannelResourceRepository = new AppChannelResourceRepository();
