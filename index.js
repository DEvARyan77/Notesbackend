const express = require('express');
const dotenv = require('dotenv');
const connect = require('./Model/Connection');
const login = require('./Controller/Login');
const signup = require('./Controller/Signup');
const validate = require('./Controller/Validate')
const notes = require('./Controller/Notes')
const transcripts = require('./Controller/Transcript')
const fetchNotes = require('./Controller/fetchNotes')
const addImage = require('./Controller/AddImage')
const deleteImage = require('./Controller/DeleteImage')
const saveHeading = require('./Controller/saveHeaading')
const makeFavourite = require('./Controller/makeFavourite')
const deleteNote = require('./Controller/deleteNote')
const writtenNote = require('./Controller/WrittenNote')
const cors = require('cors');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;
const mongoUrl = process.env.MONGO_URL;
connect(mongoUrl);

app.listen(port,()=>{
    console.log(`Listening at port ${port}`)
})

app.post('/login',login);
app.post('/signup',signup);
app.post('/validate',validate);
app.post('/notes',notes)
app.post('/transcript',transcripts)
app.post('/fetchNotes',fetchNotes)
app.post('/addImage',addImage)
app.post('/deleteImage',deleteImage)
app.post('/saveHeading',saveHeading)
app.post('/makeFavourite',makeFavourite)
app.post('/deleteNote',deleteNote)
app.post('/writtenNote',writtenNote)