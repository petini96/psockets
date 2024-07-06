import express from "express";
import * as HomeController from "../controllers/HomeController";

export const homeRoutes = express.Router();

homeRoutes.get("/" , HomeController.index);
