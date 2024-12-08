import mongoose from "mongoose";

const teacherSchema=mongoose.Schema({
    name:{
        type:String
    },
    mail:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    age:{
        type:Number,
        min:18,
        max:80
    },
    department:{
        type:String
    },
    address:{
        type:String
    },
    image:{
        type:String
    }
})

export default mongoose.model('Teachers',teacherSchema);