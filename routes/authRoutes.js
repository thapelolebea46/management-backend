import express from "express";
import {
  register,
  login,
  updateInfo,
} from "../controllers/authController.js";

const router = express.Router();

router.put("/update-info",updateInfo);
router.post("/register", register);
router.post("/login", login);

export default router;
