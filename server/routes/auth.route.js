import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validate.js";
import {
  registrationSchema,
  loginSchema,
  verifyOtpSchema,
} from "../util/schema.js";
import { verifyEmail } from "../controllers/mail.controller.js";
import { verifyOTP } from "../controllers/phone.controller.js";

//all api routes for our auth(login, register and logout) here
//and we also add data checking from joi

const router = express.Router();

router.post("/register", validateRequest(registrationSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.put("/verify-otp", validateRequest(verifyOtpSchema), verifyOTP);

export default router;
