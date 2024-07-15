import postmark from "postmark";
import nodemailer from "nodemailer";
import "dotenv/config";

export const sender = nodemailer.createTransport({
  host: "smtp.postmarkapp.com", // Postmark's SMTP server
  port: 587, // Port for secure SMTP
  auth: {
    user: process.env.POSTMARK_TOKEN, // Use your Postmark API token as the username
    pass: process.env.POSTMARK_TOKEN, // Use your Postmark API token as the password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmailVerification = (email, verificationToken, req, res) => {
  const mailInfo = {
    from: process.env.FROM,
    to: email,
    subject: "Email Verification Link",
    text: `Please verify your email by clicking the link: ${req.protocol}://${req.get("host")}/auth/verify-email?token=${verificationToken}`,
  };

  sender.sendMail(mailInfo, (error, info) => {
    if (error) {
      console.error("Error sending verification email:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(201).json({
      message:
        "User registered successfully. Please check your email for verification link.",
    });
  });
};

export const sendPhoneVerification = async (phoneNos, res) => {
  try {
    const authToken = await generateAuthToken();
    const response = await sendOtp(phoneNos, authToken);

    console.log("OTP Sent Response:", response);
    res.status(200).json({
      message: "OTP sent successfully to your phone number. Please verify.",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
