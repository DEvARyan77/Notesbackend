const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    heading: { type: String, required: true,unique: true },
    content: { type: String, required: true },
    username: { type: String, required: true },
    audio: { type: String,},
    images: { type: Array},
    new: {type:Boolean,default:true},
    favourite: {type:Boolean,default:false},
    createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;