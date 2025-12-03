import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * ============================================
 * REGISTER NEW USER
 * POST /api/auth/register
 *
 * Expected body:
 * {
 *   firstName, lastName, username, address, password
 * }
 * ============================================
 */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, username, address, password } = req.body;

    // Check if username is already taken
    const userExists = await User.findOne({ username });
    if (userExists) return res.json({ msg: "Username already exists" });

    // Hash the password before saving
    const hashedPwd = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      address,
      password: hashedPwd,
    });

    console.log(newUser.address);

    res.json({ msg: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error });
  }
};

/**
 * ============================================
 * LOGIN USER
 * POST /api/auth/login
 *
 * Expected body:
 * {
 *   username, password
 * }
 *
 * Returns:
 * - JWT token (expires in 1 day)
 * ============================================
 */
export const login = async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = await User.findOne({ username });
  if (!user) return res.json({ msg: "Invalid username" });

  // Compare provided password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.json({ msg: "Invalid password" });

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
    },
    "SECRETKEY", // Consider using process.env.JWT_SECRET instead of hardcoding
    { expiresIn: "1d" }
  );

  res.json({ msg: "Logged in", token });
};

/**
 * ============================================
 * UPDATE USER INFORMATION
 * PUT /api/auth/update-info
 *
 * Expected body:
 * {
 *   firstName?, lastName?, address?, oldPassword, newPassword?
 * }
 *
 * Notes:
 * - Old password is required to change info
 * - Password is only updated if newPassword is provided
 * - Returns a new JWT token with updated info
 * ============================================
 */
export const updateInfo = async (req, res) => {
  const { firstName, lastName, address, oldPassword, newPassword } = req.body;

  try {
    // Find user by ID from token
    const user = await User.findById(req.user.id);
    if (!user) return res.json({ msg: "User not found" });

    // Validate old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.json({ msg: "Old password is incorrect" });

    // Update allowed fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (address) user.address = address;

    // Update password only if provided
    if (newPassword && newPassword.trim() !== "") {
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
    }

    await user.save();

    // Generate new JWT with updated info
    const token = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
      },
      "SECRETKEY", // Use process.env.JWT_SECRET in production
      { expiresIn: "1d" }
    );

    return res.json({ msg: "Information updated", token });
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
};
