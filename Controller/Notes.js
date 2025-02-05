const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const saveNote = require('../View/Notes');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Set up storage configuration for multer
const storage = multer.memoryStorage(); // Store files in memory

// Initialize multer with the storage configuration
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
function Notes(req, res) {
  console.log(req.body)
  console.log('Notes request');

  upload.fields([{ name: 'image', maxCount: 10 }, { name: 'audio', maxCount: 1 }])(req, res, async function (err) {
    if (err) {
      return res.status(400).send({ error: `Multer error: ${err.message}` });
    }

    // Validate request body
    const { heading, content, username } = req.body;
    if (!heading || !content || !username) {
      return res.status(400).send({ error: 'Heading, content, and username are required' });
    }

    // Access the uploaded files through req.files
    const imageFiles = req.files['image'] || [];
    const audioFile = req.files['audio'] ? req.files['audio'][0] : null;

    try {
      // Upload images to Cloudinary if they exist
      const imageUrls = imageFiles.length > 0 ? await Promise.all(imageFiles.map(file => 
        uploadFileToCloudinary(file, 'images').catch(error => {
          throw new Error(`Cloudinary image upload error: ${error.message}`);
        })
      )) : [];

      // Upload audio to Cloudinary if it exists
      const audioUrl = audioFile ? await uploadFileToCloudinary(audioFile, 'audio').catch(error => {
        throw new Error(`Cloudinary audio upload error: ${error.message}`);
      }) : null;

      // Save the note to the database
      await saveNote(req, res, imageUrls, audioUrl);

      // Do not send any other response from here
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
}

module.exports = Notes;