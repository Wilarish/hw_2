import dotenv from 'dotenv'
import mongoose from 'mongoose'


dotenv.config()


const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017/Posts_Blogs_HW2'

if (!mongoURI)
    throw new Error("!err url")



export async function RunDb() {

    try {
        await mongoose.connect(mongoURI)
        console.log('Db connect')

    } catch (err) {
        console.log("its error", err)
        await mongoose.disconnect()

    }
}

