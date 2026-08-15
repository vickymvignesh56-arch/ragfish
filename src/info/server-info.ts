import { logger } from "../../src/config/logger.js";

export const showServerInfo = (port: number) => {
  const projectName = "ragfish";
  const description = "File Based Chat Application";
  const version = "1.0.0";

  const swaggerUrl = `http://localhost:${port}/api-docs`;
  const baseUrl = `http://localhost:${port}/api`;

  logger.info("╔════════════════════════════════════════════╗");
  logger.info("║                                            ║");
  logger.info("║                 🐟 RAGFISH                 ║");
  logger.info("║                                            ║");
  logger.info("╠════════════════════════════════════════════╣");
  logger.info(` Project     : ${projectName.padEnd(29)}`);
  logger.info(` Description : ${description.padEnd(29)}`);
  logger.info(` Version     : ${version.padEnd(29)}`);
  logger.info("                                            ");
  logger.info(` Swagger     : ${swaggerUrl.padEnd(29)}`);
  logger.info(` Base URL    : ${baseUrl.padEnd(29)}`);
  logger.info("                                            ");
  logger.info(" ════════════════════════════════════════════");
};
