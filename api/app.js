const express = require("express");
const cors = require("cors"); 
const app = express();
require("dotenv").config();
const uploadRoute = require("./routes/uploadRoute");
const mediaRoute = require("./routes/mediaRoute");
const PORT = process.env.PORT;


app.use(
  cors({
    origin: ["http://localhost:5003", "http://localhost:5173"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api", uploadRoute);
app.use("/api/media",mediaRoute);

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
