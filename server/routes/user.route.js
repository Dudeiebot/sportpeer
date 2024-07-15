import express from "express";
import {
  updateEmail,
  updatePass,
  updateUserName,
} from "../controllers/user.controller.js";
import { authToken } from "../middleware/token.js";
import {
  updateUserNameSchema,
  updateEmailSchema,
  updatePassSchema,
} from "../util/schema.js";
import { validateRequest } from "../middleware/validate.js";

const router = express.Router();

router.put(
  "/username/:id",
  authToken,
  validateRequest(updateUserNameSchema),
  updateUserName,
);
router.put(
  "/email/:id",
  authToken,
  validateRequest(updateEmailSchema),
  updateEmail,
);
router.put(
  "/pass/:id",
  authToken,
  validateRequest(updatePassSchema),
  updatePass,
);

export default router;
