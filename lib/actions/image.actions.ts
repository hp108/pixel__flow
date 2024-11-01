'use server'

import { revalidatePath } from "next/cache"
import { handleError } from "../utils"
import { connectToDatabase } from "../db/mongoose"
import User from "../db/models/user.model"
import Image from "../db/models/image.model"
import { redirect } from "next/navigation"



const populateUser = (query:any)=>{
    return query.populate({
        path:'author',
        model:User,
        select:'_id firstName LastName'
    })
}

export async function addImage({image, userId,path}:AddImageParams){
   try{
        await connectToDatabase()
        const author = await User.findById(userId)
        if(!author){
            throw new Error("User Not Found") 
        }
        console.log(image)
        const newImage = await Image.create({
            ...image,
            author: author._id
        })
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

 export async function deleteImage(imageId:string,path:string){
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

 export async function getImageById(imageId:string,path:string){
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