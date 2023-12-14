import { Router } from "express";
import { accessChat, fetchChats, createGroupChat, removeFromGroup, addToGroup, renameGroup, getGroupDetail } from "../controllers/chat.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();
router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/:groupId").get(protect, getGroupDetail);
router.route("/group/:groupId").get(protect, getGroupDetail);

export default router;