const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../todo.db'); 

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to the database', err);
    } else {
        console.log('Connected to the SQLite database');
    }
});

db.serialize(() => {
    // users table for user profiles and authentication
    db.run(`CREATE TABLE IF NOT EXISTS USERS (
        id VARCHAR(50) UNIQUE NOT NULL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE
    )`);

    // tasks table for managing user tasks
    db.run(`CREATE TABLE IF NOT EXISTS TASKS (
        id VARCHAR(50) UNIQUE NOT NULL PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(20) CHECK(status IN ('done', 'pending', 'in progress', 'completed')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
    )`);
});

module.exports = db;
