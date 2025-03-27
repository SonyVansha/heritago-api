const { getDBConnection } = require("../config/db");

// const db = getDBConnection();

const modelTour = {
  getAll: async () => {
    const db = await getDBConnection();
    const [results] = await db.query('SELECT * FROM wisata');
    db.end();
    return results;
},
  create: async (data) => {
    const db = await getDBConnection();
    const sql = 'INSERT INTO wisata (nama, lokasi, gambar, deskripsi, rating) VALUES (?, ?, ?, ?, ?)';
    const values = [data.nama, data.lokasi, data.gambar, data.deskripsi, data.rating];
    const [result] = await db.query(sql, values);
    db.end();
    return result.insertId;
},
  delete: async (data) => {
    const db = await getDBConnection();
    const sql = 'DELETE FROM wisata WHERE id = ?';
    const [result] = await db.query(sql, [data]);
    db.end();
    return result.affectedRows;
}
};

module.exports = modelTour;