import Contact from "./contact.model.js";
import { sendContactNotification } from "../../services/emailServices.js";

export const createContactMessage = async (payload) => {
  const contact = await Contact.create(payload);

  try {
    await sendContactNotification(contact);
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
