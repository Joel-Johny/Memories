const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse incoming JSON data
app.use(express.text()); // Parse incoming text data
app.use(express.urlencoded({ extended: true })); // Parse incoming URL-encoded form-data

// Connect to MongoDB
connectDB();
// Basic Route
app.get("/test-get-data", (req, res) => {
  res.send("API is running...");
});

app.post("/test-post-data", (req, res) => {
  console.log(req.body); // Will log: undefined
  res.send("Data received");
});
app.use("/api/users", userRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
