'use server'

import { revalidatePath } from "next/cache"
import { handleError } from "../utils"
import { connectToDatabase } from "../db/mongoose"
import User from "../db/models/user.model"
import Image from "../db/models/image.model"
import { redirect } from "next/navigation"
import { v2 as cloudinary } from 'cloudinary'



const populateUser = (query:any)=>{
    return query.populate({
        path:'author',
        model:User,
        select:'_id firstName LastName clerkId'
    })
}

export async function addImage({image, userId,path}:AddImageParams){
   try{
        await connectToDatabase()
        const author = await User.findById(userId)
        if(!author){
            throw new Error("User Not Found") 
        }
        
        const newImage = await Image.create({
            ...image,
            author: author._id
        })
        console.log(newImage)
        revalidatePath(path)
        return JSON.parse(JSON.stringify(newImage))
   }catch(err){
    handleError(err)
   } 
}

export async function updateImage({image, userId,path}:UpdateImageParams){
    try{
         await connectToDatabase()

         const imageToUpdate = await Image.findById(image._id) 
         
         if(!imageToUpdate || imageToUpdate.author.toHexString() !== userId ){
            throw new Error("Unauthorised or image not found")
         }
          console.log(image)
          let updatedImage = image
        //  const updatedImage = Image.findByIdAndUpdate(imageToUpdate._id,image,{new:true})
 
        revalidatePath(path)
        return JSON.parse(JSON.stringify(updatedImage))
        }catch(err){
            handleError(err)
        } 
 }

 export async function deleteImage(imageId:string,path:string="/"){
    try{
         await connectToDatabase()
         await Image.findByIdAndDelete(imageId) 
        revalidatePath(path)
    }catch(err){
     handleError(err)
    } 
    finally{
        redirect('/')
    }
 }

 export async function getImageById(imageId:string){
    try{
         await connectToDatabase()
         const image = await populateUser(Image.findById(imageId))

         if(!image) {
            throw new Error("Image Not Found")
         }
        return JSON.parse(JSON.stringify(image))
    }catch(err){
     handleError(err)
    } 
 }
 export async function getAllImages({ limit = 9, page = 1, searchQuery = '' }: {
    limit?: number;
    page: number;
    searchQuery?: string;
  }) {
    try {
      await connectToDatabase();
  
      cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      })
  
      let expression = ''
  
      if (searchQuery) {
        expression += ` ${searchQuery}`
      }
  
      const { resources } = await cloudinary.search
        .expression(expression)
        .execute();
  
      const resourceIds = resources.map((resource: any) => resource.public_id);
  
      let query = {};
  
      if(searchQuery) {
        query = {
          publicId: {
            $in: resourceIds
          }
        }
      }

      console.log(query)
  
      const skipAmount = (Number(page) -1) * limit;
  
      const images = await populateUser(Image.find(query))
        .sort({ updatedAt: -1 })
        .skip(skipAmount)
        .limit(limit);
      
      const totalImages = await Image.find(query).countDocuments();
      const savedImages = await Image.find().countDocuments();
  
      return {
        data: JSON.parse(JSON.stringify(images)),
        totalPage: Math.ceil(totalImages / limit),
        savedImages,
      }
    } catch (error) {
      handleError(error)
    }
  }

  export const addTags=async(publicId:string)=>{
    connectToDatabase()

    cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      })
      
      cloudinary.api.update(publicId, 
        { categorization: "imagga_tagging", 
            auto_tagging: 0.7 })
  }