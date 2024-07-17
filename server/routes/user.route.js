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

//all user api interaction here
//and we all so added schema checking
//we also added authorization checking

const router = express.Router();

router.put(
  "/username/:id",
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
