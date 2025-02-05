const jwt = require('jsonwebtoken');
const User = require('../Model/Model');

async function Validate(req, res) {
    try {
        const token = req.body.token;
        if (!token) {
            return res.status(403).send("No token provided");
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(500).send("Failed to authenticate token");
            }

            const getUser = await User.findOne({ username: decoded.username });
            if (!getUser) {
                return res.status(404).send("User not found");
            }
            res.status(200).send({ username: decoded.username });
        });
    } catch (error) {
        res.status(400).send("Error during validation: " + error.message);
    }
}

module.exports = Validate;