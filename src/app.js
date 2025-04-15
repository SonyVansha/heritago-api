const express = require("express");
const cors = require("cors")({ origin: true });
const bodyParser = require('body-parser');
const path = require("path");

// Import routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const tourRoutes = require("./routes/tourRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const locationRoutes = require("./routes/locationRoutes");
const quizRoutes = require("./routes/quizRoutes");

// Middleware to parse cookies
const cookieParser = require("cookie-parser");
const app = express();

// app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use("/certificates", express.static(path.join(__dirname, "public", "certificates")));
app.use(cors);

// Define routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", tourRoutes);
app.use("/api", certificateRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api", quizRoutes);

// app routes for testing server side
app.use("/", (req, res) => {
  res.send('Hello World!')
});

module.exports = app;