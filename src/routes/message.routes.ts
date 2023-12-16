import { Router } from "express";
import {
  allMessages,
  deleteMessage,
  sendMessage,
} from "../controllers/message.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);
router.route("/:id/delete").get(protect, deleteMessage);

export default router;
