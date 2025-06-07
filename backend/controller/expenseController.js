const express= require("express")
const dotenv=require("dotenv").config();
const asyncHandler=require("express-async-handler")
const Expense = require('../models/expensemodel')
const User = require('../models/userModel')
const bcrypt=require("bcrypt")
const  jwt= require("jsonwebtoken")
const jwtAuthentication = require('../middleware/jwtAuthentation');


const registerExpense= asyncHandler(async(req,res)=>{
    const {amount,type,note}=req.body
    if(!amount || !type || !note){
        res.status(401);
        throw new Error ('Amount , Type & Note is required');
    }

    const userId=req.user.id

    const user= await User.findOne({_id:userId})
    const username= user.username

    const expense= await Expense.create({
        userId:userId,
        amount,
        type,
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
 const filter = req.query.filter || '';
  console.log('Filter received:', filter);
    console.log('User ID:', userId); 
    const now = new Date(); 
    let dateFilter={};

    switch (filter) {
        case "today": {   
            const startOfDay = new Date(now);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);

            dateFilter = {
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                }
            };   
            break;
        }
            
        case "this_week": {  
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            
            dateFilter = {
                date: {
                    $gte: startOfWeek
                }
            };
            break;
        }
        
        case 'this_month': {  
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            startOfMonth.setHours(0, 0, 0, 0);
            dateFilter = {
                date: { 
                    $gte: startOfMonth
                }
            };
            break;
        }

        case 'last_month': {  
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            startOfLastMonth.setHours(0, 0, 0, 0);
            endOfLastMonth.setHours(23, 59, 59, 999);
            dateFilter = {
                date: {
                    $gte: startOfLastMonth,
                    $lte: endOfLastMonth
                }
            };
            break;
        }
        
        case 'this_year': {  
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            startOfYear.setHours(0, 0, 0, 0);
            dateFilter = {
                date: { 
                    $gte: startOfYear 
                }
            };
            break;
        }
        
        default: {
            dateFilter = {};
            break;
        }
    }
    console.log('Date filter:', dateFilter);

    const result= await Expense.find({userId: userId,...dateFilter}).sort({date:-1})

    if(!result || result.length=== 0){
        res.status(404)
        throw new Error ("Cannot find any expense")
    }else{
        res.status(200).json(result)
        console.log(result)
    }
})


module.exports={registerExpense,getExpense}