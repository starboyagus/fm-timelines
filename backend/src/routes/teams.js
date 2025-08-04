const db = require('../database');
const express = require('express');
const router = express.Router();

router.get('/teams', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();

        const [rows] = await connection.query('SELECT idTeam, name, year, img, date_created FROM teams ORDER BY date_created DESC');

        res.json(rows);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }});

router.post('/teams', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();

        const { name, year, date_created } = req.body;

        const nameNoSpaces = name.replace(/\s/g, '');
        image = nameNoSpaces + '.png'; // Assuming image is derived from name

        const [result] = await connection.query('INSERT INTO teams (name, year, img, date_created) VALUES (?, ?, ?, ?)', [name, year, image, date_created]);

        res.status(201).json({ id: result.insertId, name, year, image, date_created });
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }});

module.exports = router;