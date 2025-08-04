const db = require('../database');
const express = require('express');
const router = express.Router();

router.get('/teams-trophies', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();

        const { idTeam } = req.query;

        let rows;
        if (idTeam) {
            [rows] = await connection.query('SELECT trophies.idTrophy, trophies.img, trophies.name, teams_trophies.amount FROM teams_trophies inner join trophies ON teams_trophies.idTrophy = trophies.idTrophy WHERE teams_trophies.idTeam = ?', [idTeam]);
        } else {
            [rows] = await connection.query('SELECT * FROM teams_trophies');
        }

        res.json(rows);
    } catch (error) {
        console.error('Error fetching trophies from team:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }});

router.post('/teams-trophies', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();

        const { idTeam, idTrophy, amount } = req.body;

        const [result] = await connection.query('INSERT INTO teams_trophies (idTeam, idTrophy, amount) VALUES (?, ?, ?)', [idTeam, idTrophy, amount]);

        res.status(201).json({ idTeam, idTrophy, amount });
    } catch (error) {
        console.error('Error creating team-trophy relation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }});

router.patch('/teams-trophies', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();

        const { idTeam, idTrophy } = req.query

        const { amount } = req.body;

        const [result] = await connection.query('UPDATE teams_trophies SET amount = ? WHERE idTeam = ? AND idTrophy = ?', [amount, idTeam, idTrophy]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Update successful' });
        } else {
            res.status(404).json({ error: 'Team-Trophy relation not found' });
        }
    } catch (error) {
        console.error('Error updating team-trophy relation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }});

module.exports = router;