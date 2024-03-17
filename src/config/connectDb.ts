import mongoose from "mongoose";

const connectDB = async(DATABASE_URL:string)=>{
    try{
        const DB_OPTIONS = {
            dbName:"auth"
        }
        await mongoose.connect(DATABASE_URL , DB_OPTIONS);
        console.log('connected successfully')
    }
    catch(error){
        console.log(error)
    }
};

export {connectDB}