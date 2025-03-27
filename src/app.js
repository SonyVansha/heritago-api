const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const tourRoutes = require("./routes/tourRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Define routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", tourRoutes);

module.exports = app;