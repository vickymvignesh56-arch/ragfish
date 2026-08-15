import winston from "winston";

export const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message }) => {
      return ` ${level}: ${
        typeof message === "object" ? JSON.stringify(message) : message
      }`;
    }),
  ),
  transports: [new winston.transports.Console()],
});
