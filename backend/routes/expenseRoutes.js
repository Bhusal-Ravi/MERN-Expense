const express=require("express");
const router=express.Router();
const jwtAuthentication = require('../middleware/jwtAuthentation');
const {registerExpense,getExpense}= require ('../controller/expenseController')  



router.post('/registerexpense',jwtAuthentication,registerExpense)
router.get('/getexpense',jwtAuthentication,getExpense)

module.exports=router