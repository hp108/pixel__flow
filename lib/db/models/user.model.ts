import { model, models, Schema } from "mongoose";

const userSchema = new Schema({
    clerkId:{type:String, required:true , unique:true} ,
    email:{type:String, required:true, unique:true},
    username:{type:String},
    photo:{type:String, required:true},
    firstName:{type:String},
    lastName:{type:String},
    planId:{type:String, default: 1},
    creditBalance:{type:Number , default: 20},    
})

const User =  models?.User  || model('User', userSchema) 

export default User 