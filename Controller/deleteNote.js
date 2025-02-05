const jwt = require('jsonwebtoken');
const saveNote = require('../Model/Notes');
require('dotenv').config();

async function deleteNote(req, res) {
  console.log('Delete Note Request Received');

  // Validate request body
  const { heading, username } = req.body;
  console.log(heading);

  if (!heading || !username) {
    return res.status(400).send({ error: 'Heading and username are required' });
  }

  try {
    // Decode the JWT token to get the username
    const decoded = jwt.verify(username, process.env.JWT_SECRET);
    const user = decoded.username;

    // Find the note entry using the heading and username
    const note = await saveNote.findOne({ username: user, heading });

    if (!note) {
      return res.status(404).send({ error: 'Note not found' });
    }

    // Delete the note
    await saveNote.deleteOne({ _id: note._id });

    console.log('Deleted Note:', note);
    res.status(200).send({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: error.message });
  }
}

module.exports = deleteNote;
