const mongoose=require("mongoose")


const expenseSchema= mongoose.Schema({
    userId:{
         type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required:[true],
        
    },
    amount:{
         type: String,
        required:[true,"Amount is Required"],
    },
    category:{
         type: String,
        required:[true,"Category is Required"],
    },
    note:{
         type: String,
        required:[true,"Note is Required"],
    },
    date:{
        type:Date,
        required:[true,"Date is Required"],
    },
},{
    timestamps:true,
})

module.exports=mongoose.model('Expense',expenseSchema)