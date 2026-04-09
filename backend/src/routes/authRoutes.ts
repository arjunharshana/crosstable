import express from "express";
import {
  RegisterUser,
  VerifyEmail,
  LoginUser,
  logoutUser,
  ResendVerificationEmail,
  forgotPassword,
  ResetPassword,
  chesscomOAuthCallback,
  chesscomOAuthInitiate,
} from "../controllers/authController";
import {
  validateRegistration,
  validateLogin,
  validateOTP,
  validatePasswordReset,
  validateEmail,
} from "../middleware/validatorMiddleware";
import {
  authRateLimiter,
  otpRateLimiter,
  rateLimiter,
} from "../middleware/rateLimiter";

const router = express.Router();

router.post("/register", validateRegistration, authRateLimiter, RegisterUser);
router.post("/verify-otp", validateOTP, authRateLimiter, VerifyEmail);
router.post("/login", validateLogin, authRateLimiter, LoginUser);
router.post("/logout", rateLimiter, logoutUser);
router.post("/resend-otp", rateLimiter, ResendVerificationEmail);
router.post("/forgot-password", validateEmail, authRateLimiter, forgotPassword);
router.post(
  "/reset-password",
  validatePasswordReset,
  authRateLimiter,
  ResetPassword,
);

router.get("/chesscom", rateLimiter, chesscomOAuthInitiate);
router.get("/chesscom/callback", rateLimiter, chesscomOAuthCallback);

export default router;
