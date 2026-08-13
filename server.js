// ═════════════════════════════════════════════════════════════════════════════
//                          Import and init statements
// ═════════════════════════════════════════════════════════════════════════════

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const connectDB = require("./src/config/db");
const swaggerUi = require("swagger-ui-express");
const transactionRoutes = require("./src/routes/transactionRoutes");
const walletRoutes = require("./src/routes/walletRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
let swaggerDocument = {};

// ═════════════════════════════════════════════════════════════════════════════
//                              Logic Statements
// ═════════════════════════════════════════════════════════════════════════════

// Swagger integration
try {
  swaggerDocument = require("./swagger-output.json");
} catch (error) {
  console.log("Error in Swagger...", error.message);
}

// Connection to Mongo
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add sewagger to the app
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Sample Health Check
app.get("/", (req, res) => {
  res.status(201).json({
    success: true,
    message: "Backend is Running ✅",
  });
});

// Adding routes to app
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/wallet", walletRoutes);

// Listner
app.listen(PORT, () => {
  console.log("Server is running on PORT ", PORT);
  console.log(`Swagger Docs Available at http://localhost:${PORT}/api-docs`);
});
