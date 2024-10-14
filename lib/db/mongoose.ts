import mongoose,{Mongoose} from "mongoose";

const MONGODB_URL : string = process.env.MONGODB_URL || ""

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

declare global {
    const mongoose: MongooseConnection;
}

let cached : MongooseConnection = (global as any).mongoose

if(!cached){
    cached = (global as any).mongoose = {
        conn: null,
        promise: null
    }
}




// interface CachedMongoose {
//   conn: Mongoose | null;
//   promise: Promise<Mongoose> | null;
// }

// declare global {
//   const mongoose: CachedMongoose; 
// }

// let cached: CachedMongoose = global.mongoose || { conn: null, promise: null };

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

export const connectToDatabase= async()=>{
    if(cached.conn){
        return cached.conn
    }
    
    if(!MONGODB_URL) throw new Error('Mongodb is not Defined')

    cached.promise = cached.promise || mongoose.connect(MONGODB_URL)

    cached.conn = await cached.promise

}