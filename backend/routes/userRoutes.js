const express=require("express");
const { userLogin,userRegister,currentUser } = require("../controller/userControler");
const router=express.Router();
const jwtAuthentication = require('../middleware/jwtAuthentation');



router.post("/register",userRegister)

router.post("/login",userLogin)

router.get("/current",jwtAuthentication,currentUser)

module.exports=router