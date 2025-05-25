const express= require("express")
const dotenv= require("dotenv").config()
const app = express()
const errorHandler=require("./middleware/errorHandler")
const connectDb = require("./config/dbConnection")





const PORT=   process.env.PORT || 5000
connectDb();
app.use(express.json())
app.use("/api/users",require("./routes/userRoutes"))
app.use(errorHandler)


app.listen(PORT,()=>{
    console.log(`Server Running On Port ${PORT}`)
})
