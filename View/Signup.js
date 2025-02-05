const bcrypt = require('bcrypt');
const User = require('../Model/Model');

async function UserSave(Username,Email, Password, res) {
    try {
        const getUser = await User.findOne({ username: Username });
        if (getUser) {
            res.status(409).send("User already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(Password, 10); // Hash the password with a salt round of 10

        const user = {
            username: Username,
            email: Email,
            password: hashedPassword
        };

        const newUser = new User(user);
        await newUser.save();
        res.status(200).send("User saved");
    } catch (error) {
        res.status(400).send("Error saving user: " + error.message);
    }
}

module.exports = UserSave;