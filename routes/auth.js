import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/**
 * ============================================
 * REGISTER A NEW USER
 * POST /api/auth/register
 *
 * Expected body:
 * {
 *   "username": "john123",
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "address": "123 Main St",
 *   "password": "mypassword"
 * }
 * ============================================
 */
router.post("/register", async (req, res) => {
  const { username, firstName, lastName, address, password } = req.body;

  // Check if username already exists
  const userExists = await User.findOne({ username });
  if (userExists) return res.json({ error: "Username already exists" });

  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    username,
    firstName,
    lastName,
    address,
    password: hashed,
  });

  // Save user
  await newUser.save();
  console.log("Account created");

  res.json({ message: "Account created successfully" });
});

/**
 * ============================================
 * UPDATE USER INFORMATION
 * PUT /api/auth/update-info
 *
 * Expected body:
 * {
 *   "id": "userIdHere",
 *   "firstName": "New Name",
 *   "lastName": "New Surname",
 *   "address": "New Address",
 *   "password": "newPassword"  (optional)
 * }
 *
 * Notes:
 * - Password is updated only if provided.
 * - If password is empty or missing, old password stays.
 * ============================================
 */
router.put("/update-info", async (req, res) => {
  try {
    const { firstName, lastName, address, password, id } = req.body;

    // Prepare update object
    const updates = { firstName, lastName, address };

    // Update password ONLY if provided and not empty
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    // Update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true } // return updated user
    );

    console.log(id, ": updated successfully");

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.json({ error: "Server error" });
  }
});

/**
 * ============================================
 * LOGIN USER
 * POST /api/auth/login
 *
 * Expected body:
 * {
 *   "username": "john",
 *   "password": "mypassword"
 * }
 *
 * Returns:
 * - Success message
 * - JWT token (valid 3 days)
 *
 * JWT Includes:
 * - id
 * - firstName
 * - lastName
 * - username
 * - address
 * ============================================
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Check if username exists
  const user = await User.findOne({ username });
  if (!user) return res.json({ error: "Invalid username or password" });

  // Compare passwords
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ error: "Invalid username or password" });

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      address: user.address,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );

  res.json({ message: "Login successful", token });
});

export default router;
