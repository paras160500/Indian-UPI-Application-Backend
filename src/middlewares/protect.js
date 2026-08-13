// ═════════════════════════════════════════════════════════════════════════════
//                          Import and init statements
// ═════════════════════════════════════════════════════════════════════════════

const jwt = require("jsonwebtoken");
const User = require("../model/User");
const dotenv = require("dotenv");

dotenv.config();

// ═════════════════════════════════════════════════════════════════════════════
//                              Logical Statements
// ═════════════════════════════════════════════════════════════════════════════

const protect = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        if (!token) {
          return res.status(401).json({
            success: false,
            message: "No Authorization token available",
          });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
          return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
          });
        }
        user = await User.findById(decode.id).select("-password");
        if (!user) {
          return res.status(401).json({
            success: false,
            message: "User not found.",
          });
        }
        req.user = user;
        next();
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Error in Protecter Route",
          error: error.message,
        });
      }
    }
  } catch (error) {
    console.log("Error ", error.message);
  }
};

module.exports = protect;
