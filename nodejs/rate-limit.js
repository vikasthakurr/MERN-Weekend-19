import { rateLimit } from "express-rate-limit";

const message = {
  success: false,
  message: "too many requests",
};

export const loginLimitter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1,
  message: message,
});

export const updateLimit = rateLimit({
  windowMs: 45 * 24 * 60 * 60 * 1000,
  max: 1,
  message: message,
});


