import {
  createContactMessage,
  deleteContactMessage,
  getContactMessages,
  updateContactStatus,
} from "./contact.services.js";

export const submitContact = async (req, res, next) => {
  try {
    const contact = await createContactMessage(req.body);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const listMessages = async (req, res, next) => {
  try {
    const messages = await getContactMessages();

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const editMessageStatus = async (req, res, next) => {
  try {
    const message = await updateContactStatus(req.params.id, req.body.status);

    res.status(200).json({
      success: true,
      message: "Message status updated successfully",
      data: message,
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const removeMessage = async (req, res, next) => {
  try {
    await deleteContactMessage(req.params.id);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};
