const mongoose=require("mongoose")
mongoose.set('strictQuery', true);
const noteSchema=mongoose.Schema({
    title:String,
    body:String, 
    user:String
})

const NoteModel=mongoose.model("note",noteSchema)

module.exports={
    NoteModel
}
