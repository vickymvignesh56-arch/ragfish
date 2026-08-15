import swaggerJSDoc from "swagger-jsdoc";
import { components } from "../Openapi/components.js";

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Ragfish API",
      version: "1.0.0",
      description: "API documentation for Ragfish",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "development server",
      },
    ],
    components: components,
  },
  apis: ["./src/controllers/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
