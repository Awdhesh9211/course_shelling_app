import mongoose, {Schema} from "mongoose";
const {ObjectId} =mongoose.Types;

const courseSchema =new Schema({
   title:{type:String,trim:true},
   description:{type:String,trim:true},
   price:{type:Number,required:true},
   imageUrl:String,
   creatorId:{type:ObjectId,ref:"Admin"}
});


export const Course=mongoose.models.Course || mongoose.model("Course",courseSchema);