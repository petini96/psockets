import { Schema, model } from "mongoose";
import { IChoice } from "../model/IChoice"; 

const choiceSchema = new Schema<IChoice>({
    options: {
      type: [
        {
          id: { type: Number, required: true },
          text: { type: String, required: true },
          votes: { type: Number, default: 0 },
        },
      ],
      required: true,
      validate: {
        validator: (options: { id: number; text: string; votes: number }[]) => options.length === 2,
        message: "A escolha deve ter exatamente duas opções.",
      },
    },
    totalVotes: { type: Number, default: 0 },
  });
  
  choiceSchema.set('toJSON', {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      ret.options = ret.options.map((option: any) => {
        const { _id, ...rest } = option;
        return rest;
      });
      return ret;
    },
  });
  
  export const Choice = model<IChoice>('Choice', choiceSchema);