import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, username,address, password } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) return res.json({ msg: "Username already exists" });

    const hashedPwd = await bcrypt.hash(password, 10);

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
    res.json({ error });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.json({ msg: "Invalid username" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.json({ msg: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, firstName: user.firstName, lastName: user.lastName , address:user.address},
    "SECRETKEY",
    { expiresIn: "1d" }
  );

  res.json({ msg: "Logged in", token });
};

export const updateInfo = async (req, res) => {
  const { firstName, lastName, address, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.json({ msg: "User not found" });

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.json({ msg: "Old password is incorrect" });

    // Update allowed fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (address) user.address = address;

    // Only update password if provided
    if (newPassword && newPassword.trim() !== "") {
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
    }

    await user.save();

    // Generate new token with updated info
    const token = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
      },
      "SECRETKEY",
      { expiresIn: "1d" }
    );

    return res.json({ msg: "Information updated", token });
  } catch (err) {
    return res.json({ msg: "Server error" });
  }
};
