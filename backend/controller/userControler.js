const express= require("express")
const dotenv=require("dotenv").config();
const asyncHandler=require("express-async-handler")
const User=require("../models/userModel")
const bcrypt=require("bcrypt")
const  jwt= require("jsonwebtoken")
const jwtAuthentication = require('../middleware/jwtAuthentation');


const userRegister=asyncHandler( async (req,res)=>{


    const {username,password}=req.body
    if(!username || !password){
        res.status(400);
        throw new Error ("All the fields must be filled")
    }
    const userAvailable= await User.findOne({username});
    if(userAvailable){
        res.status(400);
        throw new Error ("Username Already Exists")
    }

    //hashing password
    const hashedPassword= await bcrypt.hash(password,10);
    console.log("hashed password",hashedPassword)

    //Adding user to database
    const user= await User.create({
        username,
        password:hashedPassword,
    })
    if(user){
        res.status(201).json({_id:user.id,username:user.username})

    }else{
        res.status(400);
        throw new Error("User Data is not valid")
    }
    res.status(201).json({username:username,password:password})
    
    console.log("register the user")
})

const userLogin = asyncHandler( async (req,res)=>{
      const  {username,password}=req.body
      if(!username || !password){
        res.status(400);
        throw new Error ("All the fields must be entered")
      }
      const userAvailable= await  User.findOne({username})
       if (!userAvailable) {
        res.status(401);
        throw new Error("Wrong Username or Password")
    }
    
    const correctPassword = await bcrypt.compare(password, userAvailable.password);
    const token = jwt.sign({
            id:userAvailable._id,
            username:userAvailable.username},
             process.env.JWT_SECRET)
    if (!correctPassword) {
        res.status(401);
        throw new Error("Wrong Username or Password")
    }
      
        res.status(201).json({message:"Login Successfull",username:userAvailable.username,id:userAvailable._id,token:token})
      

    
})

const currentUser = asyncHandler( async (req,res)=>{
          const userId = req.user.id;
    const fullUser = await User.findById(userId).select('-password')

    if (!fullUser) {
        res.status(404);
        throw new Error("User not found");
    }

    res.json(fullUser);
});


module.exports={userRegister,userLogin,currentUser}