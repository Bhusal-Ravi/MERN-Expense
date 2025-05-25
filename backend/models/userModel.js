const mongoose=require("mongoose")
const Connect= require("../config/dbConnection")

const userSchema= mongoose.Schema({
    username:{
        type: String,
        required:[true,"Username is Required"],
        unique:[true,"Username must be unique"]
    },
    password:{
        type: String,
        required:[true,"Username is Required"]
        
    }

},{
    timestamps:true,
})

module.exports= mongoose.model("User",userSchema)