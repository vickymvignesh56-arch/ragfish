import { AppDataSource } from "../config/database.js";
import { App } from "../model/app.js";

export type CreateApp = {
  name: string;
  systemPrompt: string;
  userId: string;
  slug: string;
  description: string;
  status: boolean;
  llmProvider: boolean;
};

export type UpdateApp = {
  name?: string;
  systemPrompt?: string;
  slug?: string;
  description?: string | null;
  status?: boolean;
  llmProvider?: boolean;
};

export type CreateAppChannel = {
  channelId: string;
};

export type CreateAppChannelResource = {
  channelResourceId: string;
};

export class AppRepository {
  private repository;
  constructor() {
    this.repository = AppDataSource.getRepository(App);
  }

  findAppAndLlmProvide(userId: string, appId: string): Promise<App | null> {
    return this.repository.findOne({
      where: { userId: userId, id: appId, llmProvider: true },
    });
  }

  findAppAndUserId(userId: string): Promise<App[]> {
    return this.repository.find({
      where: { userId: userId },
      relations: {
        llmProviders: true,
      },
    });
  }

  findOne(userId: string, appId: string): Promise<App | null> {
    return this.repository.findOne({
      where: { userId: userId, id: appId },
    });
  }

  findAppBySlug(userId: string, slug: string): Promise<App | null> {
    return this.repository.findOne({
      where: { userId: userId, slug },
      relations: {
        llmProviders: true,
      },
    });
  }

  async findAppSlugs(userId: string, slug: string): Promise<string[]> {
    const apps = await this.repository.find({
      select: {
        slug: true,
      },
      where: {
        userId,
        slug,
      },
      relations: {
        llmProviders: true,
      },
    });

    return apps.map((app) => app.slug);
  }

  async create(appParam: CreateApp): Promise<App | null> {
    const apps = {
      name: appParam.name,
      slug: appParam.slug,
      userId: appParam.userId,
      systemPrompt: appParam.systemPrompt,
      description: appParam.description ?? "",
      status: appParam.status ?? true,
      llmProvider: appParam.llmProvider ?? false,
    };
    return this.repository.save(apps);
  }

  async deleteApp(userId: string, appId: string): Promise<boolean> {
    const result = await this.repository.delete({ id: appId, userId });
    return (result.affected ?? 0) > 0;
  }

  async update(
    userId: string,
    appId: string,
    appParam: UpdateApp,
  ): Promise<App | null> {
    const app = await this.repository.findOne({
      where: { id: appId, userId },
    });
    if (!app) {
      return null;
    }
    Object.assign(app, appParam);
    return await this.repository.save(app);
  }
}
export const appRepository = new AppRepository();
