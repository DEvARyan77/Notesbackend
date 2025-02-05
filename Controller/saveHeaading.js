const jwt = require('jsonwebtoken');
const saveNote = require('../Model/Notes');
require('dotenv').config();

async function saveHeading(req, res) {
  console.log('Update Heading Request Received');

  // Validate request body
  const { heading, username, oldheading } = req.body;
  console.log(oldheading);

  if (!heading || !username || !oldheading) {
    return res.status(400).send({ error: 'Heading, old heading, and username are required' });
  }

  try {
    // Decode the JWT token to get the username
    const decoded = jwt.verify(username, process.env.JWT_SECRET);
    const user = decoded.username;

    // Find the note entry using old heading
    const note = await saveNote.findOne({ username: user, heading: oldheading });

    if (!note) {
      return res.status(404).send({ error: 'Note not found' });
    }

    // Update the heading with the new heading
    note.heading = heading;

    // Save the updated note
    await note.save();

    console.log('Updated Note:', note);
    res.status(200).send({ message: 'Heading updated successfully', note });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: error.message });
  }
}

module.exports = saveHeading;
