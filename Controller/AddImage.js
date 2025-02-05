const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const saveNote = require('../Model/Notes');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Set up storage configuration for multer
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Function to upload files to Cloudinary
const uploadFileToCloudinary = async (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: 'auto' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(file.buffer);
  });
};

// Route to handle both image and audio uploads
function AddImage(req, res) {
  console.log('Add Image request');

  upload.fields([{ name: 'image', maxCount: 10 }])(req, res, async function (err) {
    if (err) {
      return res.status(400).send({ error: `Multer error: ${err.message}` });
    }

    // Validate request body
    const { heading, username } = req.body;
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

      // Access the uploaded files through req.files
      const imageFiles = req.files['image'] || [];

      // Upload images to Cloudinary if they exist
      if (imageFiles.length > 0) {
        const imageUrls = await Promise.all(imageFiles.map(file =>
          uploadFileToCloudinary(file, 'images')
        ));

        // Append new images to the existing images array
        note.images = [...note.images, ...imageUrls];

        // Save the updated note entry
        await note.save();
      }

      console.log('Updated note:', note);
      res.status(200).send({ message: 'Image(s) added successfully', note });

    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ error: error.message });
    }
  });
}

module.exports = AddImage;
