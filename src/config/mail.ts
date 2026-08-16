import nodemailer from "nodemailer";
import { mailConfig } from "../env.js";

export const mailTransporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  secure: mailConfig.secure,
  auth: {
    user: mailConfig.auth.user,
    pass: mailConfig.auth.password,
  },
});
