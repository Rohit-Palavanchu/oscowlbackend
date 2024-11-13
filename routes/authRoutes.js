const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken')

const SECRET_KEY = 'my_jwt_secret_key';

router.post('/register', async (req, res) => {
    const { username, password, name, email } = req.body;

    if (!username || !password || !name || !email) {
        return res.status(400).json({ error: 'All fields are required' }); // can implement this in frontend also
    }

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkUserExists = `SELECT username, email FROM users WHERE username=? OR email=?`;
    db.get(checkUserExists, [username, email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (row) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        const insertUserQuery = `INSERT INTO users (id, username, password, name, email) VALUES (?, ?, ?, ?, ?)`;
        db.run(insertUserQuery, [id, username, hashedPassword, name, email], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(201).json({ message: 'User registered successfully', userId: id });
        });
    });
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM USERS WHERE username=?`;
    db.get(query, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving user' });
        }
        if (!user) {
            return res.status(401).json({ message: 'User not registered' });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }
            if (!result) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ token });
        });
    });
});


module.exports = router;