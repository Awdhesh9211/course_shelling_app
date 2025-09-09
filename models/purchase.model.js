import {Schema,models,model} from "mongoose";
const {ObjectId} =mongoose.Types;


const purchaseSchema =new Schema({
    userId:{type:ObjectId,ref:"User"},
    courseId:{type:ObjectId,ref:"Course"}
});


export const Purchase=models.Purchase || model("Purchase",purchaseSchema);