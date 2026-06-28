import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const hasEmailConfig = () =>
  Boolean(env.email.host && env.email.port && env.email.user && env.email.pass && env.email.from);

const createTransporter = () =>
  nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    secure: env.email.port === 465,
    auth: {
      user: env.email.user,
      pass: env.email.pass,
    },
  });

export const sendContactNotification = async (contact) => {
  if (!hasEmailConfig()) {
    return { skipped: true, reason: "Email config is incomplete" };
  }

  const transporter = createTransporter();

  return transporter.sendMail({
    from: env.email.from,
    to: env.email.from,
    replyTo: contact.email,
    subject: `Portfolio contact: ${contact.subject}`,
    text: [
      `Name: ${contact.name}`,
      `Email: ${contact.email}`,
      `Subject: ${contact.subject}`,
      "",
      contact.message,
    ].join("\n"),
  });
};
