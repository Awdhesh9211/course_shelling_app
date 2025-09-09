import mongoose,{Schema} from "mongoose";

// Schema 
const userSchema =new Schema({
  email:{type:String,unique:true},
  password:{type:String,min:[8,"password should 8 charachter long"]},
  firstName:{type:String,trim:true,min:[3,"too small firstname"]},
  lastName:{type:String},
  purchasedCourses:[
    {
      type:mongoose.Types.ObjectId,
      ref:"Course"
    },
  ]
});



export const User=mongoose.models.User || mongoose.model("User",userSchema);