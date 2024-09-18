const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
    )`);
});

const addUser = (name, email, callback) => {
  const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  stmt.run(name, email, function(err){
    if(err){
      return callback(err);
    }
    callback(null, {id: this.lastID, name, email});
  });
  stmt.finalize();
};

const getUsers = (callback) => {
  db.all("SELECT * FROM users", [], (err,rows) =>{
    if(err){
      return callback(err);
    }
    callback(null, rows);
  });
};

const filterUsers = (filter, callback) => {
  const query = `SELECT * FROM users WHERE name LIKE ? OR email LIKE ?`;
  db.all(query, [`%${filter}%`, `%${filter}%`], (err, rows) => {
    callback(err, rows);
  });
};

const deleteUser = (id, callback) => {
  db.run("DELETE FROM users WHERE id=?", id, function(err) {
    if(err){
      return callback(err);
    }
    callback(null, this.changes > 0);
  });
};

module.exports = {addUser, getUsers, filterUsers, deleteUser};