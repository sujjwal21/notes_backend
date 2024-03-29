const jwt=require("jsonwebtoken")

const authenticate=(req,res,next)=>{
    const token=req.headers.authorization
    if(token){
        jwt.verify(token,"ujjwal",(err,decoded)=>{
            if(decoded){
                req.body.user=decoded.userID
                // console.log(decoded.userID)
                next()   
            }else{
                res.send({"msg":"Token in not verified Login"})
            }
        })
    }else{
        res.send({"msg":"Please Login token not available"})
    }
}
module.exports={
    authenticate
}