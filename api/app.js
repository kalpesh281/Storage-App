const express = require("express");
const cors = require("cors"); // Make sure cors is installed
const app = express();
require("dotenv").config();
const uploadRoute = require("./routes/uploadRoute");

const PORT = process.env.PORT;

// Apply middlewares
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api", uploadRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    error: err.message || "Something went wrong!",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
