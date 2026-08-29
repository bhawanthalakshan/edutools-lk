const Contact = require('../models/Contact');

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      res.status(400);
      throw new Error('Please provide your name (at least 2 characters)');
    }

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      res.status(400);
      throw new Error('Please provide a valid email address');
    }

    if (!subject || subject.trim().length < 2) {
      res.status(400);
      throw new Error('Please provide a message subject');
    }

    if (!message || message.trim().length < 5) {
      res.status(400);
      throw new Error('Please provide a detailed message (at least 5 characters)');
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting EduTools LK. We have received your message.',
      data: {
        id: contact._id,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact,
  getContactMessages,
};
