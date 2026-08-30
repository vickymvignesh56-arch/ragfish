import { AppDataSource } from "../config/database.js";
import type { CreateAppRequest } from "../dto/apps/CreateAppRequest.js";
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

  async update(app: CreateAppRequest): Promise<App | null> {
    return this.repository.save(app);
  }
}
export const appRepository = new AppRepository();
