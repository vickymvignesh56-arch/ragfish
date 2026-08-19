import { logger } from "../../src/config/logger.js";

export const showServerInfo = (port: number) => {
  const projectName = "ragfish";
  const description = "File Based Chat Application";
  const version = "1.0.0";

  const swaggerUrl = `http://localhost:${port}/api-docs`;
  const baseUrl = `http://localhost:${port}/api`;

  logger.info("[apps]  ╔════════════════════════════════════════════╗");
  logger.info("[apps]  ║                                            ║");
  logger.info("[apps]  ║                 🐟 RAGFISH                 ║");
  logger.info("[apps]  ║                                            ║");
  logger.info("[apps]  ╠════════════════════════════════════════════╣");
  logger.info(`[apps]   Project     : ${projectName.padEnd(29)}`);
  logger.info(`[apps]   Description : ${description.padEnd(29)}`);
  logger.info(`[apps]   Version     : ${version.padEnd(29)}`);
  logger.info("[apps]                                              ");
  logger.info(`[apps]   Swagger     : ${swaggerUrl.padEnd(29)}`);
  logger.info(`[apps]   Base URL    : ${baseUrl.padEnd(29)}`);
  logger.info("[apps]                                              ");
  logger.info("[apps]   ════════════════════════════════════════════");
};
