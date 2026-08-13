// ═════════════════════════════════════════════════════════════════════════════
//                          Import and init statements
// ═════════════════════════════════════════════════════════════════════════════

const express = require("express");
const protect = require("../middlewares/protect");
const {
  sendMoney,
  getTransactionHistory,
} = require("../controllers/transactionController");
const router = express.Router();

// ═════════════════════════════════════════════════════════════════════════════
//                                Logic Statements
// ═════════════════════════════════════════════════════════════════════════════

router.post("/send", protect, sendMoney);
router.get("/history", protect, getTransactionHistory);

module.exports = router;
