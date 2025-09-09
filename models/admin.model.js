import mongoose,{Schema} from "mongoose";


const adminSchema =new Schema({
  email:{type:String,unique:true},
  password:{type:String,min:[8,"password should 8 charachter long"]},
  firstName:{type:String,trim:true,min:[3,"too small firstname"]},
  lastName:{type:String},
});



export const Admin=mongoose.models.Admin || mongoose.model("Admin",adminSchema);
