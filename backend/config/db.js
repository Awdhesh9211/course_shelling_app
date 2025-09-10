import mongoose from "mongoose";


const  DBConnect=async(DB_URL,DB_NAME) =>{
    try {
        
       const conn=await mongoose.connect(DB_URL,{dbName:DB_NAME})
       return conn;
    } catch (error) {
        throw new Error(error.message);
    }
}









export default DBConnect;
