const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models/db');
const middleware = require('./middleware');

// Get profile details
router.get('/profile-details', middleware, (req, res) => {
    const userId = req.user.id;

    const query = `SELECT name, email FROM USERS WHERE id = ?`;

    db.get(query, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving profile details' });
        }
        if (!row) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            name: row.name,
            email: row.email
        });
    });
});

// Update profile details
router.put('/profile', middleware, async (req, res) => {
    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    let updateCount = 0;
    const updatePromises = [];

    // If name is provided, update it
    if (name) {
        const nameUpdateQuery = `UPDATE USERS SET name = ? WHERE id = ?`;
        const nameUpdatePromise = new Promise((resolve, reject) => {
            db.run(nameUpdateQuery, [name, userId], (err) => {
                if (err) {
                    reject({ message: 'Error updating name' });
                } else {
                    updateCount++;
                    resolve();
                }
            });
        });
        updatePromises.push(nameUpdatePromise);
    }

    // If email is provided, update it
    if (email) {
        const emailCheckQuery = `SELECT id FROM USERS WHERE email = ?`;
        const emailUpdatePromise = new Promise((resolve, reject) => {
            db.get(emailCheckQuery, [email], (err, row) => {
                if (err) {
                    reject({ message: 'Error checking email' });
                } else if (row && row.id !== userId) {
                    reject({ message: 'Email already in use' });
                } else {
                    const emailUpdateQuery = `UPDATE USERS SET email = ? WHERE id = ?`;
                    db.run(emailUpdateQuery, [email, userId], (err) => {
                        if (err) {
                            reject({ message: 'Error updating email' });
                        } else {
                            updateCount++;
                            resolve();
                        }
                    });
                }
            });
        });
        updatePromises.push(emailUpdatePromise);
    }

    // If password is provided, validate and update it
    if (currentPassword && newPassword) {
        const passwordUpdatePromise = new Promise(async (resolve, reject) => {
            const passwordQuery = `SELECT password FROM USERS WHERE id = ?`;
            db.get(passwordQuery, [userId], async (err, user) => {
                if (err) {
                    reject({ message: 'Error retrieving user data' });
                } else if (!user) {
                    reject({ message: 'User not found' });
                } else {
                    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
                    if (!isPasswordMatch) {
                        reject({ message: 'Current password is incorrect' });
                    } else {
                        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
                        const passwordUpdateQuery = `UPDATE USERS SET password = ? WHERE id = ?`;
                        db.run(passwordUpdateQuery, [hashedNewPassword, userId], (err) => {
                            if (err) {
                                reject({ message: 'Error updating password' });
                            } else {
                                updateCount++;
                                resolve();
                            }
                        });
                    }
                }
            });
        });
        updatePromises.push(passwordUpdatePromise);
    }

    // Wait for all promises to resolve
    try {
        await Promise.all(updatePromises);

        if (updateCount > 0) {
            res.status(200).json({ message: 'Profile updated successfully' });
        } else {
            res.status(400).json({ message: 'No valid fields to update' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router