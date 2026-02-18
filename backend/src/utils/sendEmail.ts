import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("Email transporter is ready to send emails");
  })
  .catch((error) => {
    console.error("Error setting up email transporter:", error);
  });

export const sendVerificationEmail = async (
  userName: string,
  email: string,
) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const mailOptions = {
    from: {
      name: "CrossTable Support",
      address: process.env.EMAIL_USER as string,
    },
    to: email,

    subject: "CrossTable Email Verification OTP",
    html: `
        <html>
            <body>
                <p>Hi ${userName},</p>
                <p>Your OTP for CrossTable email verification is: <strong>${otp}</strong></p>
                <p>This OTP is valid for 10 minutes.</p>
                <p>Thank you for joining CrossTable!</p>
            </body>
        </html>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully to:", email);
    return otp;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (
  userName: string,
  userEmail: string,
  resetToken: string,
) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: {
      name: "CrossTable Support",
      address: process.env.EMAIL_USER as string,
    },
    to: userEmail,
    subject: "CrossTable Password Reset",
    html: `
        <html>
            <body>
                <p>Hi ${userName},</p>
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <p><a href="${resetLink}">${resetLink}</a></p>
            </body>
        </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully to:", userEmail);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};
