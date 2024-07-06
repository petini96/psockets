import { Request, Response } from "express";
import { UserStoreInput } from "../../../domain/dto/UserInput";
import { createUserUseCase } from "../../../domain/use-cases/user/CreateUser";
import { io } from '../index';

export const store = async (req: Request, res: Response): Promise<Response> => {
  const userRequest = req.body as UserStoreInput
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  userRequest.photo = "/storage/" +  req.file.filename

  try {
    const user = await createUserUseCase(userRequest)
    io.sockets.emit("user-registered", user)

    return res.status(200).json(user);
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
};

export const show = async (req: Request, res: Response): Promise<Response> => { 
  return res.status(200).json("user");
};
