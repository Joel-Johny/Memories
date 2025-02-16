const dotenv = require("dotenv");
dotenv.config(); // Load environment variables
const express = require("express");
const connectDB = require("./src/config/db");
// const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const journalRoutes = require("./src/routes/journalRoutes");
const cors = require("cors");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON data
app.use(express.text()); // Parse incoming text data
app.use(express.urlencoded({ extended: true })); // Parse incoming URL-encoded form-data

// Connect to MongoDB
connectDB();
// Basic Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.post("/test-post-data", (req, res) => {
  res.send("Data received");
});
// app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
