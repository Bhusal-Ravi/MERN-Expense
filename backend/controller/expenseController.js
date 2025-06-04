const express= require("express")
const dotenv=require("dotenv").config();
const asyncHandler=require("express-async-handler")
const Expense = require('../models/expensemodel')
const User = require('../models/userModel')
const bcrypt=require("bcrypt")
const  jwt= require("jsonwebtoken")
const jwtAuthentication = require('../middleware/jwtAuthentation');


const registerExpense= asyncHandler(async(req,res)=>{
    const {amount,category,note}=req.body
    if(!amount || !category || !note){
        res.status(401);
        throw new Error ('Amount , Category & Note is required');
    }

    const userId=req.user.id

    const user= await User.findOne({_id:userId})
    const username= user.username

    const expense= await Expense.create({
        userId:userId,
        amount,
        category,
        note,
        date: Date.now()

    })

    if(expense){
        res.status(201).json({username:username,amount:amount})
    }else{
        res.status(401)
        throw new Error("The expense type is not valid")
    }

    

} )


const getExpense= asyncHandler(async(req,res)=>{
    const userId=req.user.id
    const result= await Expense.find({userId: userId})

    if(!result || result.length=== 0){
        res.status(404)
        throw new Error ("Cannot find any expense")
    }else{
        res.status(200).json(result)
    }
})


module.exports={registerExpense,getExpense}