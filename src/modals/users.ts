import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    tc:{
        type:Boolean,
        required:true
    }
})

const userModal = mongoose.model("user",userSchema)

export default userModal