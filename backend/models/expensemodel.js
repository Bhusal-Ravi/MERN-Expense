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
    type: {
        type: String,
        enum: ["income", "expense"],
        required: [true, "Type is required"],
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