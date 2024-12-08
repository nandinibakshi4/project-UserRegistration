import mongoose from "mongoose";
export const connect = ()=>{
    const mongoDB="mongodb+srv://gulatimanya16:manyagulati1604@main.jlv89.mongodb.net/?retryWrites=true&w=majority&appName=Main";
    mongoose.connect(mongoDB,(err)=>{
        if(err){
            console.log("ERROR : UNABLE TO CONNECT");
        }
        else{
            console.log("DB CONNECTED");
        }
    })
}