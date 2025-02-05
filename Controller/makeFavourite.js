const jwt = require('jsonwebtoken');
const saveNote = require('../Model/Notes');
require('dotenv').config();

async function makeFavourite(req, res) {
  console.log('Make Favourite Request Received');

  // Validate request body
  const { username, heading } = req.body;

  if (!username || !heading) {
    return res.status(400).send({ error: 'Username and heading are required' });
  }

  try {
    // Decode the JWT token to get the username
    const decoded = jwt.verify(username, process.env.JWT_SECRET);
    const user = decoded.username;

    // Find the note entry using heading
    const note = await saveNote.findOne({ username: user, heading: heading });

    if (!note) {
      return res.status(404).send({ error: 'Note not found' });
    }

    // Set favourite to true
    note.favourite = !note.favourite;

    // Save the updated note
    await note.save();

    console.log('Updated Note:', note);
    res.status(200).send({ message: 'Note marked as favourite successfully', note });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: error.message });
  }
}

module.exports = makeFavourite;
