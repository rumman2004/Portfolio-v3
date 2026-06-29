import Contact from "./contact.model.js";
import { sendContactNotification, sendThankYouEmail } from "../../services/emailServices.js";

export const createContactMessage = async (payload) => {
  const contact = await Contact.create(payload);

  try {
    await sendContactNotification(contact);
    
    // Send automated thank you email
    const thankYouRes = await sendThankYouEmail(contact);
    if (thankYouRes && thankYouRes.messageText) {
      contact.replies.push({
        sender: "system",
        message: thankYouRes.messageText,
      });
      await contact.save();
    }

  } catch (error) {
    console.error(`Contact email failed: ${error.message}`);
  }

  return contact;
};

export const getContactMessages = async () => Contact.find().sort({ createdAt: -1 }).lean();

export const updateContactStatus = async (id, status) => {
  const contact = await Contact.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).lean();

  if (!contact) {
    const error = new Error("Contact message not found");
    error.statusCode = 404;
    throw error;
  }

  return contact;
};

export const deleteContactMessage = async (id) => {
  const contact = await Contact.findByIdAndDelete(id).lean();

  if (!contact) {
    const error = new Error("Contact message not found");
    error.statusCode = 404;
    throw error;
  }

  return contact;
};

import { improveDraftReply } from "../../services/aiServices.js";
import { sendReplyEmail } from "../../services/emailServices.js";

export const sendAdminReply = async (id, draftReply) => {
  const contact = await Contact.findById(id);
  if (!contact) {
    const error = new Error("Contact message not found");
    error.statusCode = 404;
    throw error;
  }

  // 1. Improve the draft using AI
  const aiResponse = await improveDraftReply(contact.subject, contact.message, draftReply);
  const polishedReply = aiResponse.text;
  const aiStatus = aiResponse.aiStatus;

  // 2. Send the email
  const emailRes = await sendReplyEmail(contact, polishedReply);
  if (!emailRes.success) {
    const error = new Error("Failed to send email");
    error.statusCode = 500;
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
