/**
 * ════════════════════════════════════════════════════════════════════
 * Auth Routes — JWT-based matchmaker authentication
 * ════════════════════════════════════════════════════════════════════
 * Demo credentials: matchmaker@tdc.com / tdc2024
 */

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "tdc-matchmaker-secret-2024";

// Hardcoded matchmaker credentials for MVP demo
const MATCHMAKERS = [
  {
    id: "MM001",
    email: "krishajudiya21@gmaiil.com",
    password: "12345678",
    name: "Krish Ajudiya",
    role: "Senior Matchmaker",
    avatar: "https://picsum.photos/seed/priyamehra/200/200",
  },
  {
    id: "MM002",
    email: "admin@tdc.com",
    password: "admin123",
    name: "Rahul Kapoor",
    role: "Head Matchmaker",
    avatar: "https://picsum.photos/seed/rahulkapoor/200/200",
  },
];

/**
 * POST /api/auth/login
 * Authenticates matchmaker and returns JWT token
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  const matchmaker = MATCHMAKERS.find(
    (m) => (m.email === trimmedEmail || m.email.replace('gmaiil.com', 'gmail.com') === trimmedEmail) && m.password === trimmedPassword
  );

  console.log("Login attempt:", { inputEmail: trimmedEmail, inputPass: trimmedPassword, success: !!matchmaker });

  if (!matchmaker) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate JWT token (expires in 24 hours)
  const token = jwt.sign(
    { id: matchmaker.id, email: matchmaker.email, name: matchmaker.name },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    token,
    user: {
      id: matchmaker.id,
      name: matchmaker.name,
      email: matchmaker.email,
      role: matchmaker.role,
      avatar: matchmaker.avatar,
    },
  });
});

/**
 * Middleware: Verify JWT token
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = router;
module.exports.authMiddleware = authMiddleware;
