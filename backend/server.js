const express= require("express")
const dotenv= require("dotenv").config()
const app = express()
const errorHandler=require("./middleware/errorHandler")
const connectDb = require("./config/dbConnection")
const healthCheckRoute= require('./routes/healthcheck')
const cors=require('cors');
const path = require('path');

app.use(cors({
    origin: "https://mern-expense-pink.vercel.app", 
}));



const PORT=   process.env.PORT || 5000
connectDb();
app.use(express.json())
app.use("/api/users",require("./routes/userRoutes"))
app.use("/api/users",require("./routes/expenseRoutes"))
app.use('/api',healthCheckRoute)
app.use(errorHandler)


app.listen(PORT,()=>{
    console.log(`Server Running On Port ${PORT}`)
})
