"use server";

import { revalidatePath } from "next/cache";
import User from "../db/models/user.model";
import { connectToDatabase } from "../db/mongoose";
import { handleError } from "../utils";


// // USE CREDITS
// export async function updateCredits(userId: string, creditFee: number) {
//   try {
//     await connectToDatabase();

//     const updatedUserCredits = await User.findOneAndUpdate(
//       { _id: userId },
//       { $inc: { creditBalance: creditFee }},
//       { new: true }
//     )

//     if(!updatedUserCredits) throw new Error("User credits update failed");

//     return JSON.parse(JSON.stringify(updatedUserCredits));
//   } catch (error) {
//     handleError(error);
//   }
// }


export async function createUser(user:CreateUserParams){

    try{
        await connectToDatabase() 
         const newUser =await User.create(user)
         return newUser;
    }catch(err){
        handleError(err)
    }
}

export async function getUserById(userId:string){
    try{
        await connectToDatabase()
        const user = User.findById({clerkId:userId})
        if(!user){
            throw new Error("No User Found")
        }
        return user;
    }catch(err){
        handleError(err)
    }
} 


export async function updateUser(clerkId: string,user: UpdateUserParams){
    try{
        await connectToDatabase()
        const updatedUser = User.findByIdAndUpdate({_id:clerkId},user,{
            new:true
        })
        if(!updatedUser){
            throw new Error("No user Found to update")
        }
        return updatedUser
    }catch(err){
        handleError(err)
    }

}

export async function deleteUser(clerkId:string){
        try{
            await connectToDatabase()
            const userToDelete = User.findByIdAndDelete(clerkId)
            if(!userToDelete){
                throw new Error("No User Found To Delete")
            }
            revalidatePath('/ ')
            return userToDelete;
        }catch(err){
            handleError(err)
        }
}
