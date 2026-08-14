import "reflect-metadata";
import "dotenv/config";
import { AppDataSource } from "./config/database.js";
import app from "./config/express.js";
import { PORT } from "./env.js";
import { logger } from "./config/logger.js";

AppDataSource.initialize();
app.listen(PORT, () => {
  logger.info(`Server Started on port ${PORT}`);
});
