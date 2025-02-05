const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const saveNote = require('../Model/Notes'); // MongoDB Model
require('dotenv').config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Multer Storage (Memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to upload file to Cloudinary
const uploadFileToCloudinary = async (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
};

// Function to Add Images to a Note
async function AddImages(req, res) {
  console.log("Written")
  try {
    console.log('Add Images function called');

    // Use Multer to Process Files
    await new Promise((resolve, reject) => {
      upload.array('images', 10)(req, {}, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Validate request body
    const { heading, content, username } = req.body;
    if (!heading || !content || !username) {
      return res.status(400).send({ error: 'Heading, content, and username are required' });
    }

    // Decode JWT Token to Get Username
    const decoded = jwt.verify(username, process.env.JWT_SECRET);
    const user = decoded.username;

    // Check if a note with the same heading and username already exists
    let existingNote = await saveNote.findOne({ username: user, heading });
    if (existingNote) {
      return res.status(400).send({ error: 'A note with the same heading already exists for this user' });
    }

    // Create a new Note or Update if it does not exist
    let note = new saveNote({ username: user, heading, content, images: [] });

    // Upload images to Cloudinary
    const imageFiles = req.files || [];
    if (imageFiles.length > 0) {
      const imageUrls = await Promise.all(imageFiles.map(file =>
        uploadFileToCloudinary(file, 'notes_images')
      ));

      // Append new images to the note's image array
      note.images.push(...imageUrls);
    }

    // Save the Note
    await note.save();

    console.log('Note Created:', note);
    return res.status(200).send({ message: 'Note created successfully, images uploaded', note });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send({ error: error.message });
  }
}

module.exports = AddImages;
