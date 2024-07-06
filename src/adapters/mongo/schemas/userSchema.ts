import { Schema, model } from "mongoose"
import { IUser } from "../model/IUser"

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    photo: { type: String, required: false }
});

export const User = model<IUser>('User', userSchema)
