import { Schema, model } from "mongoose"; 
import { INews } from "../model/INews";
 
const newsSchema = new Schema<INews>({
    title: { type: String, required: true },
    message: { type: String, required: false }
});

export const News = model<INews>('News', newsSchema);
