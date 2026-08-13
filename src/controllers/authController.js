// ═════════════════════════════════════════════════════════════════════════════
//                          Import and init statements
// ═════════════════════════════════════════════════════════════════════════════

const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ═════════════════════════════════════════════════════════════════════════════
//                              Register User
// ═════════════════════════════════════════════════════════════════════════════

const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    // Check the name email password and phone is empty or not
    if (!name || !email || !password || !phone) {
      return res.status(401).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    // Check if the use available or not
    let existedUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existedUser) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }
    // Check the length of password
    if (password.length <= 5) {
      return res.status(401).json({
        success: false,
        message: "Password length should be more than 5 char",
      });
    }
    // Check if the phone number is having 10 digits
    if (phone.length !== 10) {
      return res.status(401).json({
        success: false,
        message: "Invalid Phone number",
      });
    }
    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // UPI Id
    const sanatizedname = email.toLowerCase();
    const upiId = `${sanatizedname.split("@")[0]}@phonepay`;
    // Creating a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      upiId,
    });
    // Generated JWT Tokens
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        upiId: user.upiId,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in Register user",
      error: error.message,
    });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
//                              Login User
// ═════════════════════════════════════════════════════════════════════════════

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check the name email password and phone is empty or not
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    // Check if the user is there or not in the db
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not available",
      });
    }
    // check if the password match or not
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      upiId: user.upiId,
      token: generateToken(user._id),
      balance: user.balance,
      hasMpinSet: !!user.hasMpin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in Register user",
      error: error.message,
    });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
//                              Set MPIN
// ═════════════════════════════════════════════════════════════════════════════

const setMPin = async (req, res) => {
  const { mpin } = req.body;
  try {
    // Check if the use pass the valid mpin or not
    if (!mpin || mpin.length !== 4) {
      return res.status(401).json({
        success: false,
        message: "Please provide m-pin having only 4 digit",
      });
    }
    // Generating the hash for the mpin
    const salt = await bcrypt.genSalt(10);
    const hashedMpin = await bcrypt.hash(mpin, salt);
    // Fetching user by id and then updating user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { mpin: hashedMpin, hasMpin: true },
      { new: true },
    );
    if (user) {
      res.status(201).json({
        success: true,
        message: "M-PIN Upaded successfully.",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to set M-Pin",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in Register user",
      error: error.message,
    });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
//                              Get user Profile
// ═════════════════════════════════════════════════════════════════════════════

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -mpin");
    if (user) {
      res.status(200).json({
        success: true,
        user,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in Register user",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  setMPin,
  getUserProfile,
};
