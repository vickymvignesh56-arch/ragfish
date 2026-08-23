import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import { authorizationChecker } from "../middleware/authorization.middleware.js";
import { loggerMiddleware } from "../middleware/logger.middleware.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";
import { AuthController } from "../controllers/AuthController.js";
import { LLMProviderController } from "../controllers/LLMProviderController.js";
import { ErrorHandlerMiddleware } from "../middleware/errorHandler.middleware.js";

const app = createExpressServer({
  cors: true,
  routePrefix: "/api",
  controllers: [AuthController, LLMProviderController],
  middlewares: [loggerMiddleware, ErrorHandlerMiddleware],
  defaultErrorHandler: false,
  authorizationChecker: authorizationChecker,
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
