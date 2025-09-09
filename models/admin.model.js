import {Schema,models,model, Model} from "mongoose";


const adminSchema =new Schema({
  email:{type:String,unique:true},
  password:{type:String,min:[8,"password should 8 charachter long"]},
  firstName:{type:String,trim:true,min:[3,"too small firstname"]},
  lastName:{type:String},
});



export const Admin=models.Admin || model("Admin",adminSchema);
