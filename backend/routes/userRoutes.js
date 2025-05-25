const express=require("express");
const { userLogin,userRegister,currentUser } = require("../controller/userControler");
const router=express.Router();



router.post("/register",userRegister)

router.post("/login",userLogin)

router.get("/current",currentUser)

module.exports=router