require("dotenv").config();
const express = require("express");
const app = require("./src/app");
const { initializeDatabase, initializeDatabaseWisata } = require("./src/config/db");

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    await initializeDatabase();
    await initializeDatabaseWisata();
    console.log(`Server running on port ${PORT}`);
});