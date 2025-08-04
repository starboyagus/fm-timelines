const db = require('../database');
const express = require('express');
const router = express.Router();

router.get('/players', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();

        const { name } = req.query;

        let rows;
        if (name) {
            [rows] = await connection.query('SELECT * FROM players WHERE name LIKE ?', [`%${name}%`]);
        } else {
            [rows] = await connection.query('SELECT * FROM players');
        }

        res.json(rows);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }});

router.post('/players', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();

        const { name, position } = req.body;

        const nameNoSpaces = name.replace(/\s/g, '');
        const image = nameNoSpaces + '.png'; // Assuming image is derived from name

        const [result] = await connection.query('INSERT INTO players (name, position, img) VALUES (?, ?, ?)', [name, position, image]);

        res.status(201).json({ id: result.insertId, name, position, image });
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }});

module.exports = router;