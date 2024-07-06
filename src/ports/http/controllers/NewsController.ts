import { Request, Response } from "express"
import { io } from '../index'
import { NewsStoreInput } from "../../../domain/dto/NewsInput"
import { createNewsUseCase } from "../../../domain/use-cases/news/CreateNews"

export const store = async (req: Request, res: Response): Promise<Response> => {
  const newsRequest = req.body as NewsStoreInput
  try {
    const news = await createNewsUseCase(newsRequest)
    io.sockets.emit("news", news)
    return res.status(200).json(news);
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
};

export const show = async (req: Request, res: Response): Promise<Response> => { 
  return res.status(200).json("news");
};
 