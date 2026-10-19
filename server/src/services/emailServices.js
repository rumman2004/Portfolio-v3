import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const hasEmailConfig = () =>
  Boolean(
    env.email.host &&
      env.email.port &&
      env.email.user &&
      env.email.pass &&
      env.email.from
  );

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

const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]
  );

const sanitizeHeader = (value) =>
  String(value ?? "")
    .replace(/[\r\n\u0000-\u001f\u007f]/g, " ")
    .trim();

const formatTextAsHtml = (value) =>
  String(value ?? "")
    .split(/\r?\n/)
    .map((line) => (line.trim() ? `<p>${escapeHtml(line)}</p>` : "<br>"))
    .join("");

const generateEmailHTML = (title, bodyHtml) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); max-width: 600px; width: 100%;">
          <tr>
            <td style="background-color: #2563eb; padding: 30px 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 600; letter-spacing: 0.5px;">${escapeHtml(title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px; color: #374151; font-size: 15px; line-height: 1.6;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 25px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 13px;">
                This message was sent securely from the portfolio of <strong style="color: #334155;">Rumman Ahmed</strong>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const emailUnavailable = () => ({
  success: false,
  skipped: true,
  reason: "Email configuration is incomplete",
});

const emailFailed = () => ({
  success: false,
  skipped: false,
  reason: "Email delivery failed",
});

export const sendContactNotification = async (contact) => {
  if (!hasEmailConfig()) {
    return emailUnavailable();
  }

  const name = String(contact.name ?? "");
  const email = String(contact.email ?? "").trim();
  const subject = String(contact.subject ?? "Portfolio contact");
  const message = String(contact.message ?? "");

  const textBody = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    "",
    message,
  ].join("\n");

  const htmlBody = `
    <h3 style="margin-top: 0; color: #1f2937;">New Message Details:</h3>
    <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; margin-bottom: 20px;">
      <tr>
        <td width="80" style="color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Name:</td>
        <td style="color: #0f172a; font-weight: 500; border-bottom: 1px solid #e2e8f0;">${escapeHtml(name)}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Email:</td>
        <td style="color: #0f172a; font-weight: 500; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${escapeHtml(email)}" style="color: #2563eb; text-decoration: none;">${escapeHtml(email)}</a></td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Subject:</td>
        <td style="color: #0f172a; font-weight: 500;">${escapeHtml(subject)}</td>
      </tr>
    </table>
    <h4 style="color: #1f2937; margin-bottom: 10px;">Message Content:</h4>
    <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; color: #334155; white-space: pre-wrap;">${escapeHtml(message)}</div>
  `;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: env.email.from,
      to: env.email.from,
      replyTo: email,
      subject: `Portfolio contact: ${sanitizeHeader(subject)}`,
      text: textBody,
      html: generateEmailHTML("New Contact Form Submission", htmlBody),
    });
    return { success: true, skipped: false };
  } catch (error) {
    console.error("Failed to send contact notification email:", error.message);
    return emailFailed();
  }
};

export const sendThankYouEmail = async (contact) => {
  const name = String(contact.name ?? "");
  const email = String(contact.email ?? "").trim();
  const subject = String(contact.subject ?? "Portfolio contact");
  const messageText = `Hi ${name},\n\nThank you for reaching out to me through my portfolio!\n\nI have received your message regarding "${subject}" and will get back to you as soon as possible.\n\nBest regards,\nRumman Ahmed`;

  if (!hasEmailConfig()) {
    return { ...emailUnavailable(), messageText };
  }

  const bodyHtml = `
    <p style="margin-top: 0;">Hi <strong>${escapeHtml(name)}</strong>,</p>
    <p>Thank you for reaching out to me through my portfolio!</p>
    <p>I have received your message regarding "<em>${escapeHtml(subject)}</em>" and will get back to you as soon as possible.</p>
    <br>
    <p style="margin-bottom: 0;">Best regards,<br><strong>Rumman Ahmed</strong></p>
  `;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: env.email.from,
      to: email,
      subject: `Thank you for contacting me! - ${sanitizeHeader(subject)}`,
      text: messageText,
      html: generateEmailHTML("Message Received", bodyHtml),
    });
    return { success: true, skipped: false, messageText };
  } catch (error) {
    console.error("Failed to send automated thank you email:", error.message);
    return emailFailed();
  }
};

export const sendReplyEmail = async (contact, replyText) => {
  if (!hasEmailConfig()) {
    return emailUnavailable();
  }

  const safeReplyText = String(replyText ?? "");
  const subject = String(contact.subject ?? "Portfolio contact");

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: env.email.from,
      to: String(contact.email ?? "").trim(),
      subject: `Re: ${sanitizeHeader(subject)}`,
      text: safeReplyText,
      html: generateEmailHTML(
        `Re: ${subject}`,
        formatTextAsHtml(safeReplyText)
      ),
    });
    return { success: true, skipped: false };
  } catch (error) {
    console.error("Failed to send reply email:", error.message);
    return emailFailed();
  }
};
