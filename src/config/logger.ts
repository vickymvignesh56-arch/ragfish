import winston from "winston";

export const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${
        typeof message === "object" ? JSON.stringify(message) : message
      }`;
    }),
  ),
  transports: [new winston.transports.Console()],
});
