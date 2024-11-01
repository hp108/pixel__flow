import { model, models, Schema } from "mongoose";

export interface Image  extends Document{
    title:string;
    tranformation:  string;
    publicId:  string;
    secureURL : string;
    width?:number;
    height?:number;
    author: {
        _id:string;
        firstname:string;
        lastname:string; 
    },
    config?:object;
    transformationURL? : string;
    aspectRation:  string;
    color?: string;
    prompt?:string;
    createdAt?: Date;
    updatedAt?: Date;
}


const imageSchema = new Schema({
    title:{type:String, required:true},
    transformationType : {type: String, required: true},
    publicId: {type: String, required: true},
    secureURL : {type:String, required:true},
    width:{type:Number},
    height:{type:Number},
    config:{type: Object},
    transformationURL : { type: String, required:true },
    aspectRation: {type: String},
    color:{type: String},
    prompt:{type:String},
    author : {type: Schema.Types.ObjectId , ref:'User'}, 
    createdAt:{type: Date, default : Date.now},
    updatedAt:{type: Date, default : Date.now},
})

const Image = models.image ||  model('Image', imageSchema)

export default Image;
