import mongoose, {Schema,models, model} from "mongoose";
const {ObjectId}=mongoose.Types;


// Schema 
const userSchema =new Schema({
  email:{type:String,unique:true},
  password:{type:String,min:[8,"password should 8 charachter long"]},
  firstName:{type:String,trim:true,min:[3,"too small firstname"]},
  lastName:{type:String},
  purchasedCourses:[
    {
      type:ObjectId,
      ref:"Course"
    },
  ]
});



export const User=models.User || model("User",userSchema);