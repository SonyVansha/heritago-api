const mysql = require("mysql2/promise");

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};

async function initializeDatabase() {
    try {
        const db = await mysql.createConnection(dbConfig);
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);
        db.end();
        console.log("Database initialized");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

async function initializeDatabaseWisata() {
    try {
        const db = await mysql.createConnection(dbConfig);
        await db.execute(`
            CREATE TABLE IF NOT EXISTS wisata (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nama VARCHAR(255) NOT NULL,
                lokasi VARCHAR(255) NOT NULL,
                gambar VARCHAR(255) NOT NULL,
                deskripsi TEXT NOT NULL,
                rating FLOAT NOT NULL
            )
        `);
        db.end();
        console.log("Database initialized Wisata");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

async function getDBConnection() {
    return await mysql.createConnection(dbConfig);
}


module.exports = { initializeDatabase, initializeDatabaseWisata, getDBConnection };