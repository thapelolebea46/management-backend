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
//INFORMATION UPDATING ROUTE
router.put("/update-info", async (req, res) => {
  try {
    const { firstName, lastName, address, password , id} = req.body;

    const updates = { firstName, lastName, address };

    // Only update password if provided
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      console.log(password);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.body.id,
      { $set: updates },  
      { new: true }
    );
    console.log(req.body.id,": updated successfully: ",password);

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.json({ error: "Server error" });
  }
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



export default router;
