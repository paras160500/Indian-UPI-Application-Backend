// ═════════════════════════════════════════════════════════════════════════════
//                          Import and init statements
// ═════════════════════════════════════════════════════════════════════════════

const Transaction = require("../model/Transaction");
const User = require("../model/User");
const bcrypt = require("bcryptjs");

// ═════════════════════════════════════════════════════════════════════════════
//                               Send money Logic
// ═════════════════════════════════════════════════════════════════════════════

const sendMoney = async (req, res) => {
  try {
    // Getting the info from body
    const { phone, amount, mpin } = req.body;
    // Getting sender id
    const senderId = req.user._id;
    // Check if the receiverUpiId amount and mpin is there or not
    if (!amount || !mpin || !phone) {
      return res.status(401).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    // Check if the amount which need to be send is 0 or what
    if (amount <= 0) {
      return res.status(401).json({
        success: false,
        message: "Please enter valid amount",
      });
    }
    // Getting the sender information
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(401).json({
        success: false,
        message: "Sender information is invalid",
      });
    }
    // Check the mpin is correct or not
    const isMpinMatch = await bcrypt.compare(mpin, sender.mpin);
    if (!isMpinMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid M-Pin",
      });
    }
    // Findingt the receiver
    const receiver = await User.findOne({ phone });
    if (!receiver) {
      return res.status(401).json({
        success: false,
        message: "Invalid receiver phone number",
      });
    }
    // Check if user is giving his own number
    if (phone === sender.phone) {
      return res.status(401).json({
        success: false,
        message: "Cant Send money to self",
      });
    }
    // Check if the sender has sufficient balance
    if (sender.balance < amount) {
      return res.status(401).json({
        success: false,
        message: "Insuffient Balance",
      });
    }
    // Transfer logic
    sender.balance -= amount;
    receiver.balance += amount;
    // Saving the infroamtion
    await sender.save();
    await receiver.save();
    // Saving a transation to transaction table
    const transaction = await Transaction.create({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      types: "TRANSFER",
      status: "COMPLETED",
    });
    await transaction.save();
    res.status(200).json({
      success: true,
      message: "Money transfered ✅",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in Sending money",
      error: error.message,
    });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
//                               Getting Transactions
// ═════════════════════════════════════════════════════════════════════════════

const getTransactionHistory = async (req, res) => {
  try {
    // Getting the user id from the req
    const userId = req.user._id;
    // Getting the transaction based on the current user id match with sender or receiver
    const transaction = await Transaction.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name email phone")
      .populate("receiver", "name email phone")
      .sort({ timestamp: -1 });
    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting the trasaction history",
      error: error.message,
    });
  }
};

module.exports = {
  sendMoney,
  getTransactionHistory,
};
