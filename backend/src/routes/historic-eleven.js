const db = require('../database');
const express = require('express');
const router = express.Router();

router.get('/historic-eleven', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();

        const { idTeam } = req.query;

        let rows;
        if (idTeam) {
            [rows] = await connection.query('select img, year, description from historic_eleven where idTeam = ? order by year asc', [idTeam]);
        } else {
            [rows] = await connection.query('select img, year, description from historic_eleven order by year asc');
        }    

        res.json(rows);
    } catch (error) {
        console.error('Error fetching trophies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }});

router.post('/historic-eleven', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();

        const { idTeam, description, year } = req.body;

        image = (idTeam) + 'Team' + (year) + '.png'; // Assuming image is derived from name''

        const [result] = await connection.query('INSERT INTO historic_eleven (idTeam, description, year, img) VALUES (?, ?, ?, ?)', [idTeam, description, year, image]);

        res.status(201).json({ id: result.insertId, idTeam, description, year, image });
    } catch (error) {
        console.error('Error creating historic eleven:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }});

module.exports = router;