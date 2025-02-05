const Notes = require('../Model/Notes');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function fetchNotes(req, res) {
    try {
        const token = req.body.username;
        if (!token) {
            return res.status(400).send({ error: 'Token is required' });
        }

        // Decode the token to get the username
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        // Fetch notes from the Notes collection using the decoded username
        const notes = await Notes.find({ username });

        // Send the fetched notes as the response
        res.status(200).send(notes);
    } catch (error) {
        res.status(400).send("Error during validation: " + error.message);
    }
}

module.exports = fetchNotes;