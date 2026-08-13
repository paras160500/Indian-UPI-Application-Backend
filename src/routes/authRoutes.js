// ═════════════════════════════════════════════════════════════════════════════
//                          Import and init statements
// ═════════════════════════════════════════════════════════════════════════════

const express = require("express");
const {
  registerUser,
  loginUser,
  setMPin,
  getUserProfile,
} = require("../controllers/authController");
const protect = require("../middlewares/protect");
const router = express.Router();

// ═════════════════════════════════════════════════════════════════════════════
//                                Logic Statements
// ═════════════════════════════════════════════════════════════════════════════

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/set-mpin", protect, setMPin);
router.get("/profile", protect, getUserProfile);

module.exports = router;
