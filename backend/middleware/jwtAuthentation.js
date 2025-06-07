const jwt= require('jsonwebtoken')
const dotenv= require("dotenv").config();

async function jwtAuthentication (req,res,next){
    const authHeader= req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        res.status(401);
        throw new Error ("No Authority To Access The Serivce")
    }
    const token= authHeader.split(' ')[1];

    try{
        const user=jwt.verify(token,process.env.JWT_SECRET)
        console.log("Jwt user verified")
        req.user=user
      next();
    } catch (err) {
        res.status(401);
        throw new Error("Invalid or expired token");
    }
};

module.exports = jwtAuthentication;