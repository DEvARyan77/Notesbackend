const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const saveNote = require('../Model/Notes');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Route to handle both image and audio uploads
async function DeleteImage(req, res) {
  console.log('Delete Image request');

    // Validate request body
    const { heading, username } = req.body;
    console.log(req.body)
    if (!heading || !username) {
      return res.status(400).send({ error: 'Heading and username are required' });
    }

    try {
      // Decode the JWT token to get the username
      const decoded = jwt.verify(username, process.env.JWT_SECRET);
      const user = decoded.username;

      // Find the note entry for the user
      const note = await saveNote.findOne({ username: user, heading: heading });

      if (!note) {
        return res.status(404).send({ error: 'Note not found' });
      }
        // Append new images to the existing images array
        note.images = note.images.filter(img => img !== req.body.image);

        // Save the updated note entry
        await note.save();
      

      console.log('Updated note:', note);
      res.status(200).send({ message: 'Image(s) added successfully', note });}
     catch (error) {
      console.error('Error:', error);
      res.status(500).send({ error: error.message });
    }}

module.exports = DeleteImage;
