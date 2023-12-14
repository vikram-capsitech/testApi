import { Router } from "express";
import { allMessages, sendMessage } from "../controllers/message.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

export default router;