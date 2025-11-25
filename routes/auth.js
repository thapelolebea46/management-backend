import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { username, firstName, lastName,address, password } = req.body;

  const userExists = await User.findOne({ username });
  if (userExists) return res.json({ error: "Username already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    firstName,
    lastName,
      address,
    password: hashed,
  
  });

  await newUser.save();
  console.log("Account created")
  res.json({ message: "Account created successfully" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.json({ error: "Invalid username or password" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ error: "Invalid username or password" });

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

// UPDATE PASSWORD
router.post("/update-password", async (req, res) => {
  const { username, newPassword } = req.body;

  const hashed = await bcrypt.hash(newPassword, 10);

  await User.findOneAndUpdate({ username }, { password: hashed });

  res.json({ message: "Password updated" });
});

export default router;
