// ═════════════════════════════════════════════════════════════════════════════
//                          Import and init statements
// ═════════════════════════════════════════════════════════════════════════════

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
MONGO_URI = process.env.MONGO_URI;

// ═════════════════════════════════════════════════════════════════════════════
//                              Logic Statements
// ═════════════════════════════════════════════════════════════════════════════

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB");
  } catch (error) {
    console.log("Error :- ", error.message);
  }
};

module.exports = connectDB;
