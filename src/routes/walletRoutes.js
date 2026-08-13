// ═════════════════════════════════════════════════════════════════════════════
//                          Import and init statements
// ═════════════════════════════════════════════════════════════════════════════

const express = require("express");
const protect = require("../middlewares/protect");
const { payBill, addMoney } = require("../controllers/walletControllers");
const router = express.Router();

// ═════════════════════════════════════════════════════════════════════════════
//                                Logic Statements
// ═════════════════════════════════════════════════════════════════════════════

router.post("/pay-bill", protect, payBill);
router.post("/add-money", protect, addMoney);

module.exports = router;
