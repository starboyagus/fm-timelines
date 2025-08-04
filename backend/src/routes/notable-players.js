const db = require('../database');
const express = require('express');
const router = express.Router();

router.get('/notable-players', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();

        const { idTeam } = req.query;

        let rows;
        if (idTeam) {
            [rows] = await connection.query('SELECT players.idPlayer, players.name, players.img, players.position FROM notable_players inner join players on notable_players.idPlayer = players.idPlayer where notable_players.idTeam = ?', [idTeam]);
        } else {
            [rows] = await connection.query('SELECT players.name, players.img FROM notable_players inner join players on notable_players.idPlayer = players.idPlayer');
        }    

        res.json(rows);
    } catch (error) {
        console.error('Error fetching player-teams relation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }});

router.post('/notable-players', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();

        const { idPlayer, idTeam } = req.body;

        const [result] = await connection.query('INSERT INTO notable_players (idPlayer, idTeam) VALUES (?, ?)', [idPlayer, idTeam]);

        res.status(201).json({ idPlayer, idTeam });
    } catch (error) {
        console.error('Error creating player-teams relation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }});

module.exports = router;