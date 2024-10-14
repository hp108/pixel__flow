import { Schema, model, models } from "mongoose";

const transactionSchema = new Schema({
    amount:{ type:Number, required:true},
    stripeId: {type:String , required:true, unique:true},
    createdAt:{type:String},
    plan:{type:String},
    credits:{type:Number},
    buyer:{type:Schema.Types.ObjectId, ref :'User'},
})



const Transaction = models?.Transaction || model("Transaction", transactionSchema);

export default Transaction; 