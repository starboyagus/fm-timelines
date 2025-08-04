const db = require('../database');
const express = require('express');
const router = express.Router();
var n = 3; // Initialize n for event image naming

router.get('/events', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();

        const { idTeam } = req.query;

        let rows;
        if (idTeam) {
            [rows] = await connection.query('SELECT idEvent, season, name, description, img FROM events WHERE idTeam = ? ORDER BY idEvent asc', [idTeam]);
        } else {
            [rows] = await connection.query('SELECT * FROM events');
        }

        res.json(rows);
    } catch (error) {
        console.error('Error fetching events from Team:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }});

router.post('/events', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();

        const { name, description, idTeam, season } = req.body;

        n = n + 1; // Increment n for each new event
        const image = idTeam + 'event' + n + '.png'; // Assuming image is derived from name

        const [result] = await connection.query('INSERT INTO events (name, description, img, idTeam, season) VALUES (?, ?, ?, ?, ?)', [name, description, image, idTeam, season]);

        res.status(201).json({ id: result.insertId, name, description, image, idTeam, season });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }});

module.exports = router;