const mongoose=require("mongoose")
mongoose.set('strictQuery', true);
const userSchema=mongoose.Schema({
    name:String,
    age:Number,
    email:String,
    pass:String
},{
    versionKey:false
})

const UserModel=mongoose.model("user",userSchema)

module.exports={
    UserModel
}