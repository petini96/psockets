import express from "express";
import * as NewsController from "../controllers/NewsController";

export const newsRoutes = express.Router();

newsRoutes.post("/news" , NewsController.store);
