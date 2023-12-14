import { Router } from "express";
import {
  registerUser,
  authUser,
  allUsers,
  GetUserDetail,
  UpdateUserDetail,
} from "../controllers/user.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.route("/").get(protect, allUsers);
router.route("/:clientId").get(protect, GetUserDetail);
router.route("/:clientId/update").post(protect, UpdateUserDetail);
router.route("/").post(registerUser);
router.post("/login", authUser);

export default router;
