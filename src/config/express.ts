import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import { authorizationChecker } from "../middleware/authorization.middleware.js";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { loggerMiddleware } from "../middleware/logger.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = createExpressServer({
  cors: true,
  routePrefix: "/api",
  controllers: [__dirname + "/../controllers/**/*.{js,ts}"],
  middlewares: [loggerMiddleware],
  defaultErrorHandler: false,
  authorizationChecker: authorizationChecker,
});
export default app;
