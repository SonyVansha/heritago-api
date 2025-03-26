const { getDBConnection } = require("../config/db");

// Get all users
const getUsers = async (req, res) => {
  try {
    const db = await getDBConnection();
    const [users] = await db.execute('SELECT id, username FROM users');
    db.end();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
}
};

module.exports = { getUsers };