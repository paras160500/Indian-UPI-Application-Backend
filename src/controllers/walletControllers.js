// ═════════════════════════════════════════════════════════════════════════════
//                          Import and init statements
// ═════════════════════════════════════════════════════════════════════════════

const Transaction = require("../model/Transaction");
const User = require("../model/User");
const bcrypt = require("bcryptjs");

// ═════════════════════════════════════════════════════════════════════════════
//                               Add Money Wallet
// ═════════════════════════════════════════════════════════════════════════════

const addMoney = async (req, res) => {
  try {
    // Getting the amount and user id from req
    const { amount } = req.body;
    const userId = req.user._id;
    // Check if the amount is <= 0
    if (amount <= 0) {
      return res.status(401).json({
        success: false,
        message: "Amount should be greater than 0",
      });
    }
    // Find the user from the userid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid User",
      });
    }
    // updating the user balance
    user.balance += amount;
    await user.save();
    // Updating the trasactions
    const transaction = await Transaction.create({
      sender: user._id,
      receiver: user._id,
      amount,
      types: "ADD_MONEY",
      status: "COMPLETED",
    });
    res.status(201).json({
      success: true,
      message: "Money added to your account ✅",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in adding money to wallet",
      error: error.message,
    });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
//                               Pay bill Wallet
// ═════════════════════════════════════════════════════════════════════════════

const payBill = async (req, res) => {
  try {
    const { billerName, amount, mpin } = req.body;
    const userId = req.user._id;

    if (amount <= 0) {
      return res.status(401).json({
        success: false,
        message: "Amount should be greater than 0",
      });
    }
    if (!billerName || !amount || !mpin) {
      return res.status(401).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid user",
      });
    }
    const isMpinMatch = await bcrypt.compare(mpin, user.mpin);
    if (!isMpinMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid M-Pin provided",
      });
    }
    if (user.balance < amount) {
      return res.status(401).json({
        success: false,
        message: "Invalid M-Pin provided",
      });
    }
    user.balance -= amount;
    await user.save();
    const transaction = await Transaction.create({
      sender: user._id,
      receiver: user._id,
      amount,
      billerName,
      types: "BILL_PAYMENT",
      status: "COMPLETED",
    });
    await transaction.save();
    res.status(201).json({
      success: true,
      message: "Bill Payment ✅",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in paying bill",
      error: error.message,
    });
  }
};

module.exports = {
  payBill,
  addMoney,
};
