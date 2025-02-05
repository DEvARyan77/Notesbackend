const mongoose = require('mongoose');

function connect(URL) {
    mongoose.connect(URL)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((error) => {
            console.error("Error connecting to MongoDB: ", error);
        });
}

module.exports = connect;