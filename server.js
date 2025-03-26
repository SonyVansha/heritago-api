require("dotenv").config();
const express = require("express");
const app = require("./src/app");
const { initializeDatabase } = require("./src/config/db");

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    await initializeDatabase();
    console.log(`Server running on port ${PORT}`);
});