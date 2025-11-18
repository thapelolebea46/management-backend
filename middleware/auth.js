const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const raw = req.header("Authorization") || "";
  const token = raw.startsWith("Bearer ") ? raw.slice(7) : raw;
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { username }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
