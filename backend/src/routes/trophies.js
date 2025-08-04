const db = require('../database');
const express = require('express');
const router = express.Router();

router.get('/trophies', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();

        const [rows] = await connection.query('SELECT * FROM trophies');

        res.json(rows);
    } catch (error) {
        console.error('Error fetching trophies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }});

router.post('/trophies', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();

        const { name } = req.body;

        const nameNoSpaces = name.replace(/\s/g, '');
        image = nameNoSpaces + '.png'; // Assuming image is derived from name

        const [result] = await connection.query('INSERT INTO trophies (name, img) VALUES (?, ?)', [name, image]);

        res.status(201).json({ id: result.insertId, name, image });
    } catch (error) {
        console.error('Error creating trophy:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }});

module.exports = router;