const constants= require("../constants")

const errorHandler = (err,req,res,next)=>{
    const statusCode= res.statusCode? res.statusCode:500;

    switch (statusCode) {
        case constants.NOT_FOUND:
            res.json({
                title:'Not Found',
                message: err.message,
            })
            
            break;
      case constants.VALIDATION_ERROR:
            res.json({
                title:'Validation Error',
                message: err.message,
            })
            
            break;
              case constants.SERVER_ERROR:
            res.json({
                title:'Server Error',
                message: err.message,
            })
            
           
            
            
        default:
            console.log("No Error All Good")
            break;
    }
}
module.exports= errorHandler