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

export const updatePassword = async (req, res) => {
  const { username, newPassword } = req.body;

  const hashed = await bcrypt.hash(newPassword, 10);

  await User.findOneAndUpdate({ username }, { password: hashed });

  res.json({ msg: "Password updated" });
};
