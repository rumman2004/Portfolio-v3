import Contact from "./contact.model.js";
import { sendContactNotification, sendThankYouEmail } from "../../services/emailServices.js";
import { assertValidObjectId, notFoundError } from "../../utils/mongo.js";

export const createContactMessage = async (payload) => {
  const contact = await Contact.create(payload);

  const [notificationAttempt, thankYouAttempt] = await Promise.allSettled([
    sendContactNotification(contact),
    sendThankYouEmail(contact),
  ]);

  const notification = notificationAttempt.status === "fulfilled"
    ? notificationAttempt.value
    : { success: false, skipped: false, reason: "Email delivery failed" };
  const thankYou = thankYouAttempt.status === "fulfilled"
    ? thankYouAttempt.value
    : { success: false, skipped: false, reason: "Email delivery failed" };

  if (notificationAttempt.status === "rejected") {
    console.error("Contact notification email failed:", notificationAttempt.reason?.message);
  }
  if (thankYouAttempt.status === "rejected") {
    console.error("Contact thank-you email failed:", thankYouAttempt.reason?.message);
  }

  if (thankYou.success && thankYou.messageText) {
    try {
      contact.replies.push({
        sender: "system",
        message: thankYou.messageText,
      });
      await contact.save();
    } catch (error) {
      console.error("Failed to save thank-you email record:", error.message);
    }
  }

  return {
    contact,
    emailDelivery: {
      notification: {
        success: Boolean(notification.success),
        skipped: Boolean(notification.skipped),
        ...(notification.reason ? { reason: notification.reason } : {}),
      },
      thankYou: {
        success: Boolean(thankYou.success),
        skipped: Boolean(thankYou.skipped),
        ...(thankYou.reason ? { reason: thankYou.reason } : {}),
      },
    },
  };
};

export const getContactMessages = async () => Contact.find().sort({ createdAt: -1 }).lean();

export const updateContactStatus = async (id, status) => {
  assertValidObjectId(id, "contact message");
  const contact = await Contact.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).lean();

  if (!contact) {
    throw notFoundError("Contact message");
  }

  return contact;
};

export const deleteContactMessage = async (id) => {
  assertValidObjectId(id, "contact message");
  const contact = await Contact.findByIdAndDelete(id).lean();

  if (!contact) {
    throw notFoundError("Contact message");
  }

  return contact;
};

import { improveDraftReply } from "../../services/aiServices.js";
import { sendReplyEmail } from "../../services/emailServices.js";

export const sendAdminReply = async (id, draftReply) => {
  assertValidObjectId(id, "contact message");
  const contact = await Contact.findById(id);
  if (!contact) {
    throw notFoundError("Contact message");
  }

  // 1. Improve the draft using AI
  const aiResponse = await improveDraftReply(contact.subject, contact.message, draftReply);
  const polishedReply = aiResponse.text;
  const aiStatus = aiResponse.aiStatus;

  // 2. Send the email
  const emailRes = await sendReplyEmail(contact, polishedReply);
  if (!emailRes.success) {
    const error = new Error(emailRes.reason || "Failed to send email");
    error.statusCode = 502;
    throw error;
  }

  // 3. Save the reply in database and mark as replied
  contact.status = "replied";
  contact.replies.push({
    sender: "admin",
    message: polishedReply,
    aiStatus: aiStatus,
  });

  await contact.save();
  return contact.toObject();
};
