const jwt = require("jsonwebtoken");

/**
 * Middleware to protect routes using JWT
 * - Checks if the request has a valid token
 * - Attaches decoded user info to req.user
 */
module.exports = function (req, res, next) {
  // Get token from Authorization header
  const raw = req.header("Authorization") || "";

  // Remove "Bearer " prefix if present
  const token = raw.startsWith("Bearer ") ? raw.slice(7) : raw;

  // If no token, deny access
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to req.user
    // Example: { id, username, firstName, lastName, address }
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Token is invalid or expired
    return res.status(401).json({ message: "Invalid token" });
  }
};
