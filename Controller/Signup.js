const UserSave = require('../View/Signup');
async function Signup(req,res){
    if(!req.body.Username || !req.body.Email || !req.body.Password){
        res.status(422).send("Please enter all the fields");
        return;
    }
    if(req.body.Password.length<8){
        res.status(423).send("Password length is less than 8 characters");
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(req.body.Email)) {
        res.status(424).send("Invalid email format");
        return;
    }
    console.log("Signup Request")
    await UserSave(req.body.Username,req.body.Email,req.body.Password,res);
}

module.exports = Signup;