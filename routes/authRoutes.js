import express from "express";
import {
  register,
  login,
  updateInfo,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * ========================================
 *  UPDATE USER INFORMATION
 *  PUT /api/auth/update-info
 *
 *  Example body:
 *  {
 *    "username": "john",
 *    "firstName": "John",
 *    "lastName": "Doe"
 *  }
 * ========================================
 */
router.put("/update-info", updateInfo);

/**
 * ========================================
 *  REGISTER NEW USER
 *  POST /api/auth/register
 *
 *  Example body:
 *  {
 *    "username": "john",
 *    "password": "mypassword",
 *    "firstName": "John",
 *    "lastName": "Doe"
 *  }
 * ========================================
 */
router.post("/register", register);

/**
 * ========================================
 *  LOGIN USER
 *  POST /api/auth/login
 *
 *  Example body:
 *  {
 *    "username": "john",
 *    "password": "mypassword"
 *  }
 * ========================================
 */
router.post("/login", login);

export default router;
