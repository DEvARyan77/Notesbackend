const Note = require('../Model/Notes');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function saveNote(req, res, imageUrls, audioUrl) {
    try {
        const token = req.body.username;
        if (!token) {
            return res.status(400).send({ error: 'Token is required' });
        }

        // Decode the token to get the username
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        const { heading, content } = req.body;

        // Create a new note document
        const newNote = new Note({
            heading,
            content,
            username,
            audio: audioUrl,
            images: imageUrls,
            createdAt: new Date() // Save the current timestamp
        });

        // Save the note to the database
        await newNote.save();

        console.log('Note saved successfully:', newNote);
        res.status(200).send({ message: 'Note saved successfully', note: newNote });
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).send({ error: error.message });
    }
}

module.exports = saveNote;