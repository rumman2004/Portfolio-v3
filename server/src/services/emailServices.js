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
          
          <!-- Header -->
          <tr>
            <td style="background-color: #2563eb; padding: 30px 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 600; letter-spacing: 0.5px;">${title}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px; color: #374151; font-size: 15px; line-height: 1.6;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
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

export const sendContactNotification = async (contact) => {
  if (!hasEmailConfig()) {
    return { skipped: true, reason: "Email config is incomplete" };
  }

  const transporter = createTransporter();

  const textBody = [
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `Subject: ${contact.subject}`,
    "",
    contact.message,
  ].join("\n");

  const htmlBody = `
    <h3 style="margin-top: 0; color: #1f2937;">New Message Details:</h3>
    <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; margin-bottom: 20px;">
      <tr>
        <td width="80" style="color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Name:</td>
        <td style="color: #0f172a; font-weight: 500; border-bottom: 1px solid #e2e8f0;">${contact.name}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Email:</td>
        <td style="color: #0f172a; font-weight: 500; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${contact.email}" style="color: #2563eb; text-decoration: none;">${contact.email}</a></td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Subject:</td>
        <td style="color: #0f172a; font-weight: 500;">${contact.subject}</td>
      </tr>
    </table>
    <h4 style="color: #1f2937; margin-bottom: 10px;">Message Content:</h4>
    <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; color: #334155; white-space: pre-wrap;">${contact.message}</div>
  `;

  return transporter.sendMail({
    from: env.email.from,
    to: env.email.from,
    replyTo: contact.email,
    subject: `Portfolio contact: ${contact.subject}`,
    text: textBody,
    html: generateEmailHTML("New Contact Form Submission", htmlBody),
  });
};

export const sendThankYouEmail = async (contact) => {
  const messageText = `Hi ${contact.name},\n\nThank you for reaching out to me through my portfolio!\n\nI have received your message regarding "${contact.subject}" and will get back to you as soon as possible.\n\nBest regards,\nRumman Ahmed`;

  if (!hasEmailConfig()) {
    return { skipped: true, reason: "Email config is incomplete", messageText };
  }

  const transporter = createTransporter();

  const bodyHtml = `
    <p style="margin-top: 0;">Hi <strong>${contact.name}</strong>,</p>
    <p>Thank you for reaching out to me through my portfolio!</p>
    <p>I have received your message regarding "<em>${contact.subject}</em>" and will get back to you as soon as possible.</p>
    <br>
    <p style="margin-bottom: 0;">Best regards,<br><strong>Rumman Ahmed</strong></p>
  `;

  try {
    await transporter.sendMail({
      from: env.email.from,
      to: contact.email,
      subject: `Thank you for contacting me! - ${contact.subject}`,
      text: messageText,
      html: generateEmailHTML("Message Received", bodyHtml),
    });
    return { success: true, messageText };
  } catch (error) {
    console.error("Failed to send automated thank you email:", error);
    return { success: false, messageText: null };
  }
};

export const sendReplyEmail = async (contact, replyText) => {
  if (!hasEmailConfig()) {
    console.warn("Email config is incomplete, skipping sendReplyEmail but returning success for DB save.");
    return { success: true };
  }

  const transporter = createTransporter();

  // Convert plaintext newlines to HTML breaks
  const formattedReplyHtml = replyText
    .split('\n')
    .map(line => line.trim() ? `<p>${line}</p>` : '<br>')
    .join('');

  try {
    await transporter.sendMail({
      from: env.email.from,
      to: contact.email,
      subject: `Re: ${contact.subject}`,
      text: replyText,
      html: generateEmailHTML(`Re: ${contact.subject}`, formattedReplyHtml),
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send reply email:", error);
    return { success: false, error: error.message };
  }
};
