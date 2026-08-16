import path from "path";
import { mailTransporter } from "../config/mail.js";
import ejs from "ejs";
import { mailConfig } from "../env.js";

export class MailService {
  async sendMail(emailId: string, name: string) {
    const templatePath = path.join(process.cwd(), "views", "MailTemplate.ejs");
    const html = await ejs.renderFile(templatePath, { name });
    await mailTransporter.sendMail({
      from: mailConfig.from,
      to: emailId,
      subject: "Welcome to Ragfish 🎉",
      html,
    });
  }
}
export const mailService = new MailService();
