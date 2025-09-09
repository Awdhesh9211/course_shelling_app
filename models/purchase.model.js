import mongoose,{Schema} from "mongoose";
const {ObjectId} =mongoose.Types;


const purchaseSchema =new Schema({
    userId:{type:ObjectId,ref:"User"},
    courseId:{type:ObjectId,ref:"Course"}
});


export const Purchase=mongoose.models.Purchase || mongoose.model("Purchase",purchaseSchema);