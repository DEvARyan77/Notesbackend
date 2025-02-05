const UserLogin = require('../View/Login');
function Login(req,res){
    if(!req.body.Username || !req.body.Password){
        res.status(422).send("Please enter all the fields");
        return;
    }
    if(req.body.Password.length<8){
        res.status(423).send("Password length is less than 8 characters");
        return;
    }
    UserLogin(req.body.Username,req.body.Password,res);
    console.log("Login Request")
}

module.exports = Login;