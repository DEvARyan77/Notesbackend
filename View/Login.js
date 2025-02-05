const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/Model');

async function UserLogin(Username, Password, res) {
    try {
        const getUser = await User.findOne({ username: Username });
        if (!getUser) {
            res.status(404).send("User does not exist");
            return;
        }

        const isPasswordValid = await bcrypt.compare(Password, getUser.password);
        if (!isPasswordValid) {
            res.status(401).send("Invalid password");
            return;
        }

        const token = jwt.sign({username: getUser.username }, process.env.JWT_SECRET, { expiresIn: '1000000000h' });

        res.status(200).send({token});
    } catch (error) {
        res.status(400).send("Error during login: " + error.message);
    }
}

module.exports = UserLogin;