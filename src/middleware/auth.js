const jwt = require("jsonwebtoken");

// For API routes — responds with JSON 401, never redirects
function requireAuthApi(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.clearCookie("token");
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = { requireAuthApi };