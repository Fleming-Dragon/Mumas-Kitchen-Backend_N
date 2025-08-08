const express = require("express");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const router = express.Router();

// Configure nodemailer (you'll need to set up actual email credentials)
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact form submission
router.post(
  "/",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2-50 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("message")
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Message must be between 10-1000 characters"),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Please provide a valid phone number"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { name, email, message, phone } = req.body;

      // Email content
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "contact@anandagro.com", // Replace with actual business email
        subject: `New Contact Form Submission from ${name}`,
        html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <small>Sent from Anand Agro Industry website contact form</small>
      `,
      };

      // Send email (comment out if email is not configured)
      // await transporter.sendMail(mailOptions);

      // For demo purposes, we'll just log the contact submission
      console.log("Contact form submission:", { name, email, message, phone });

      res.json({
        success: true,
        message: "Thank you for your message! We will get back to you soon.",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to send message. Please try again later.",
      });
    }
  }
);

// Get business information
router.get("/info", (req, res) => {
  try {
    const businessInfo = {
      companyName: "Anand Agro Industry",
      address: {
        street: "Nashik, Maharashtra",
        city: "Nashik",
        state: "Maharashtra",
        country: "India",
        pincode: "422001",
      },
      contact: {
        phone: "+91-9876543210",
        email: "contact@anandagro.com",
        whatsapp: "+91-9876543210",
      },
      businessHours: {
        weekdays: "9:00 AM - 6:00 PM",
        saturday: "9:00 AM - 4:00 PM",
        sunday: "Closed",
      },
      socialMedia: {
        facebook: "https://facebook.com/anandagro",
        instagram: "https://instagram.com/anandagro",
        twitter: "https://twitter.com/anandagro",
      },
    };

    res.json({
      success: true,
      data: businessInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch business information",
    });
  }
});

module.exports = router;
