const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  billerName: {
    type: String,
    required: false,
  },
  types: {
    type: String,
    enum: ["TRANSFER", "ADD_MONEY", "BILL_PAYMENT", "WITHDRAWAL"],
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "FAILED"],
    default: "PENDING",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
