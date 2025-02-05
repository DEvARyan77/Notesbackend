const saveNote = require('../View/Notes');
require('dotenv').config();

async function Notes(req, res) {
    console.log('Transcript request');

    try {
      await saveNote(req, res, null, null);

      // Do not send any other response from here
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  ;
}

module.exports = Notes;