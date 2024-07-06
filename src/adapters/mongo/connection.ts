import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const dbHost = process.env.DB_HOST || "mongodb"
const dbPort = process.env.DB_PORT || "27017"
const dbDatabase = process.env.DB_DATABASE || "psockets"

connectDatabase().catch(err => console.log(err))

export async function connectDatabase() {
    const connection = await mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbDatabase}`)
    return connection
}