import "reflect-metadata";
import "dotenv/config";
import { AppDataSource } from "./config/database.js";
import app from "./config/express.js";
import { PORT } from "./env.js";
import { showServerInfo } from "./info/server-info.js";

await AppDataSource.initialize();
app.listen(PORT, () => {
  showServerInfo(PORT);
});
