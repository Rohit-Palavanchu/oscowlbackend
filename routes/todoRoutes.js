const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const middleware = require('./middleware');
const db = require('../models/db');
// Get ToDo
router.get('/todos', middleware, (req, res) => {
    const userId = req.user.id;

    const getTodosQuery = `SELECT id, title, description, status, created_at, last_modified FROM TASKS WHERE user_id = ?`;
    
    db.all(getTodosQuery, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving todos' });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No todos found for this user' });
        }
        res.status(200).json({ todos: rows });
    });
});

// Add a ToDo
router.post('/todo', middleware, (req, res) => {
    const { title, description, status } = req.body;
    const id = uuidv4();
    const userId = req.user.id;
    const createdAt = new Date().toISOString();
    const lastModified = createdAt;

    const insertTodo = `INSERT INTO TASKS (id, user_id, title, description, status, created_at, last_modified) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(insertTodo, [id, userId, title, description, status || 'pending', createdAt, lastModified], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error adding todo' });
        }
        res.status(201).json({ message: 'Todo added successfully', todoId: id });
    });
});

// Update ToDo
router.put('/todo/:id', middleware, (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user.id;
    const lastModified = new Date().toISOString();

    const updateTodo = `UPDATE TASKS SET title = ?, description = ?, status = ?, last_modified = ? WHERE id = ? AND user_id = ?`;
    db.run(updateTodo, [title, description, status, lastModified, id, userId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating todo' });
        }
        res.status(200).json({ message: 'Todo updated successfully' });
    });
});

// Delete ToDO
router.delete('/todo/:id', middleware, (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const checkTodoExists = `SELECT id FROM TASKS WHERE id = ? AND user_id = ?`;
    
    db.get(checkTodoExists, [id, userId], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking todo existence' });
        }

        if (!row) {
            return res.status(404).json({ message: `No todo found with id ${id}` });
        }

        const deleteTodo = `DELETE FROM TASKS WHERE id = ? AND user_id = ?`;
        
        db.run(deleteTodo, [id, userId], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error deleting todo' });
            }
            res.status(200).json({ message: 'Todo deleted successfully' });
        });
    });
});


//Update ToDO status
router.put('/todo/:id/status', middleware, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const statusUpdateQuery = `UPDATE TASKS SET status = ? WHERE id = ? AND user_id = ?`;
    db.run(statusUpdateQuery, [status, id, userId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating task status' });
        }
        res.status(200).json({ message: 'Task status updated successfully' });
    });
});

module.exports = router