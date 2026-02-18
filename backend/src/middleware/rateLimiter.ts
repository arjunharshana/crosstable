import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: true,
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message:
    "Too many authentication attempts from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: true,
});

const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many OTP requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: true,
});

export { rateLimiter, authRateLimiter, otpRateLimiter };
